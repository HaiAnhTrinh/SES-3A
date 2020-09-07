package com.ses3a.backend.firebase;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.ses3a.backend.Configs;
import com.ses3a.backend.entity.object.CartProduct;
import com.ses3a.backend.entity.request.*;
import org.springframework.stereotype.Service;

import javax.validation.constraints.NotNull;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
public class FirebaseCartServices {

    //Add the product to vendor's cart
    public void addToCart(@NotNull AddToCartRequest request) {
        Firestore firestore = FirestoreClient.getFirestore();
        Map<String, Object> data = new HashMap<>();
        StringBuilder productId = new StringBuilder();
        productId.append(request.getProduct().getSupplierEmail());
        productId.append("-");
        productId.append(request.getProduct().getProductName());

        data.put("productName", request.getProduct().getProductName());
        data.put("productPrice", request.getProduct().getProductPrice());
        data.put("productCategory", request.getProduct().getProductCategory());
        data.put("supplierEmail", request.getProduct().getSupplierEmail());
        data.put("productDescription", request.getProduct().getProductDescription());
        data.put("productImageUrl", request.getProduct().getProductImageUrl());
        data.put("quantity", request.getQuantity());

        //add to node 'carts'
        firestore.collection(Configs.CARTS_COLLECTION)
                .document(request.getEmail())
                .collection(productId.toString())
                .document(Configs.INFO)
                .set(data);
    }


    //Get a list of products in a vendor's cart
    public List<CartProduct> getCartProduct(@NotNull GetCartRequest request)
            throws ExecutionException, InterruptedException {

        Firestore firestore = FirestoreClient.getFirestore();
        List<CartProduct> cartProducts = new ArrayList<>();

        //Get the reference list of products in the cart
        Iterable<CollectionReference> collectionRefs =
                firestore.collection(Configs.CARTS_COLLECTION)
                        .document(request.getEmail())
                        .listCollections();

        //Iterate through all collection of products
        for (CollectionReference ref : collectionRefs) {
            Map<String, Object> data = ref.document(Configs.INFO).get().get().getData();
            CartProduct product = new CartProduct();
            String price = data.get("productPrice").toString();
            String quantity = data.get("quantity").toString();

            //calculate the cost
            double cost = Double.parseDouble(price) * Integer.parseInt(quantity);

            product.setName(data.get("productName").toString());
            product.setPrice(price);
            product.setQuantity(quantity);
            product.setCategory(data.get("productCategory").toString());
            product.setDescription(data.get("productDescription").toString());
            product.setImageUrl(data.get("productImageUrl").toString());
            product.setSupplier(data.get("supplierEmail").toString());
            product.setCost(String.valueOf(cost));

            cartProducts.add(product);
        }

        return cartProducts;
    }


    //Remove a product from the cart
    public void removeFromCart(RemoveFromCartRequest request) {
        Firestore firestore = FirestoreClient.getFirestore();
        StringBuilder productId = new StringBuilder();
        productId.append(request.getSupplierEmail());
        productId.append("-");
        productId.append(request.getProductName());

        try {
            ApiFuture<QuerySnapshot> future =
                    firestore.collection(Configs.CARTS_COLLECTION)
                            .document(request.getEmail())
                            .collection(productId.toString())
                            .get();

            // future.get() blocks on document retrieval
            List<QueryDocumentSnapshot> documents = future.get().getDocuments();
            for (QueryDocumentSnapshot document : documents) {
                document.getReference().delete();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    //Make the purchase
    //Update vendor and supplier stocks
    //Update the market stocks
    //Update vendor and supplier purchase record
    //Clear the cart
    //TODO: add to supplier's revenue
    public boolean purchase(PurchaseRequest request) throws ExecutionException, InterruptedException {
        Firestore firestore = FirestoreClient.getFirestore();
        AtomicBoolean flag = new AtomicBoolean(true);
        //ref to the BO's credit
        DocumentReference creditRef = firestore.collection(Configs.USERS_COLLECTION).document(Configs.VENDOR_TYPE)
                .collection(request.getEmail()).document("creditInfo");
        double totalCost = 0;

        for (CartProduct cartProduct : request.getCartProducts()) {
            totalCost += Double.parseDouble(Objects.requireNonNull(cartProduct.getCost()));
            ApiFuture<String> futureTransaction = firestore.runTransaction(transaction -> {

                //ref to the supplier product in node 'users'
                DocumentReference supplierProductRef = FirebaseUtils
                        .getOneSupplierProduct(firestore, cartProduct.getSupplier(), cartProduct.getName())
                        .document(Configs.INFO);
                DocumentSnapshot supplierProductSnapshot = transaction.get(supplierProductRef).get();

                //ref to the product in node 'products'
                DocumentReference productsProductRef =
                        firestore.collection(Configs.PRODUCTS_COLLECTION)
                                .document(cartProduct.getCategory())
                                .collection(cartProduct.getSupplier())
                                .document(cartProduct.getName());

                //ref to the vendor purchase record
                CollectionReference vendorPurchaseRef =
                        firestore.collection(Configs.VENDOR_PURCHASES_COLLECTION)
                                .document(request.getEmail())
                                .collection("purchaseHistory");

                //ref to the supplier purchase record
                CollectionReference supplierPendingPurchaseRef =
                        firestore.collection(Configs.SUPPLIER_PURCHASES_COLLECTION)
                                .document(cartProduct.getSupplier())
                                .collection("pendingPurchases");

                //ref to the supplier revenue
                DocumentReference revenueRef = firestore.collection(Configs.REVENUE_COLLECTION).document(cartProduct.getSupplier());

                int supplierQuantity = Integer.parseInt(Objects.requireNonNull(supplierProductSnapshot.get("quantity")).toString());
                int requestQuantity = Integer.parseInt(cartProduct.getQuantity());
                int supplierRemainingStock = supplierQuantity - requestQuantity;
                double cost = Double.parseDouble(Objects.requireNonNull(cartProduct.getCost()));

                //if sufficient, update the supplier stock, the market and supplier revenue
                if (supplierRemainingStock >= 0) {
                    transaction.update(supplierProductRef, "quantity", String.valueOf(supplierRemainingStock));
                    transaction.update(productsProductRef, "quantity", String.valueOf(supplierRemainingStock));
                    if(revenueRef.get().get().get(FirebaseUtils.getFormattedDate()) != null){
                        double newRevenue = Double.parseDouble(Objects.requireNonNull(revenueRef.get().get().get(FirebaseUtils.getFormattedDate())).toString())
                                + cost;
                        transaction.update(revenueRef, FirebaseUtils.getFormattedDate(), String.valueOf(newRevenue));
                    }
                    else{
                        transaction.update(revenueRef, FirebaseUtils.getFormattedDate(), String.valueOf(cost));
                    }
                } else {
                    System.out.println("not sufficient stock");
                    flag.set(false);
                    System.out.println("flag in case of insufficient: " + flag.toString());
                    return "Fail";
                }

                //clear the cart, add to vendor stock, vendor purchase and supplier pending purchase
                //if the product already exists on the vendors onlineProduct, do update instead of add
                FirebaseProductServices firebaseProductServices = new FirebaseProductServices();
                FirebasePurchaseServices firebasePurchaseServices = new FirebasePurchaseServices();
                RemoveFromCartRequest removeRequest =
                        new RemoveFromCartRequest(request.getEmail(), cartProduct.getName(), cartProduct.getSupplier());

                if (!FirebaseUtils.vendorHasOnlineProduct(firestore, request.getEmail(),
                        cartProduct.getName(), cartProduct.getSupplier())) {
                    AddProductRequest addRequest =
                            new AddProductRequest(request.getEmail(), Configs.BUSINESS_OWNER, cartProduct.getName(),
                                    cartProduct.getPrice(), cartProduct.getQuantity(), cartProduct.getDescription(),
                                    cartProduct.getImageUrl(), cartProduct.getCategory(), cartProduct.getSupplier());
                    firebaseProductServices.addProduct(addRequest);
                } else {
                    String currentQuantity = Objects.requireNonNull(FirebaseUtils
                            .getOneVendorProduct(firestore, request.getEmail(), cartProduct.getName(), cartProduct.getSupplier())
                            .document(Configs.INFO)
                            .get()
                            .get()
                            .get("quantity")).toString();
                    String newQuantity = String.valueOf(Integer.parseInt(currentQuantity) + requestQuantity);
                    EditProductRequest editRequest =
                            new EditProductRequest(request.getEmail(), Configs.BUSINESS_OWNER, cartProduct.getName(),
                                    cartProduct.getPrice(), newQuantity, cartProduct.getCategory(),
                                    cartProduct.getDescription(), cartProduct.getSupplier());
                    firebaseProductServices.editProduct(editRequest);
                }

                removeFromCart(removeRequest);
                firebasePurchaseServices.addConfirmedPurchase(vendorPurchaseRef, cartProduct);
                firebasePurchaseServices.addConfirmedPurchase(supplierPendingPurchaseRef, cartProduct);

                return Configs.SUCCESS_MESSAGE;
            });
        }
        if(request.isUseCredit()){
            double credit = Double.parseDouble(Objects.requireNonNull(creditRef.get().get().get("credit")).toString());
            System.out.println("Current credit: " + credit);
            credit -= totalCost;
            System.out.println("Remaining credit: " + credit);
            creditRef.update("credit", String.valueOf(credit));
        }
        System.out.println("flag in the end: " + flag.toString());
        return flag.get();
    }

}
