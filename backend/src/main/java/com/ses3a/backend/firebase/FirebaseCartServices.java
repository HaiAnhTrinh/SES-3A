package com.ses3a.backend.firebase;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
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

        data.put("name", request.getProduct().getProductName());
        data.put("price", request.getProduct().getProductPrice());
        data.put("category", request.getProduct().getProductCategory());
        data.put("supplier", request.getProduct().getSupplierEmail());
        data.put("quantity", request.getQuantity());

        //add to node 'carts'
        firestore.collection("carts")
                .document(request.getEmail())
                .collection(productId.toString())
                .document("info")
                .set(data);

    }


    //Get a list of products in a vendor's cart
    public List<CartProduct> getCartProduct(@NotNull GetCartRequest request)
            throws ExecutionException, InterruptedException {

        Firestore firestore = FirestoreClient.getFirestore();
        List<CartProduct> cartProducts = new ArrayList<>();

        //Get the reference list of products in the cart
        Iterable<CollectionReference> collectionRefs =
                firestore.collection("carts")
                        .document(request.getEmail())
                        .listCollections();

        //Iterate through all collection of products
        for(CollectionReference ref : collectionRefs){
            Map<String, Object> data = ref.document("info").get().get().getData();
            CartProduct product = new CartProduct();
            String price = data.get("price").toString();
            String quantity = data.get("quantity").toString();

            //calculate the cost
            double cost = Double.parseDouble(price) * Integer.parseInt(quantity);

            product.setName(data.get("name").toString());
            product.setPrice(price);
            product.setQuantity(quantity);
            product.setCategory(data.get("category").toString());
            product.setSupplier(data.get("supplier").toString());
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

        try{
            ApiFuture<QuerySnapshot> future =
                    firestore.collection("carts")
                            .document(request.getEmail())
                            .collection(productId.toString())
                            .get();

            // future.get() blocks on document retrieval
            List<QueryDocumentSnapshot> documents = future.get().getDocuments();
            for (QueryDocumentSnapshot document : documents) {
                document.getReference().delete();
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }


    //Make the purchase
    //Update supplier stocks
    //Update the market stocks
    //Clear the cart
    //TODO: add to vendors stocks
    public boolean purchase(PurchaseRequest request) {
        Firestore firestore = FirestoreClient.getFirestore();
        AtomicBoolean flag = new AtomicBoolean(true);
        WriteBatch batch = firestore.batch();

        for (CartProduct cartProduct: request.getCartProducts()){
            ApiFuture<String> futureTransaction = firestore.runTransaction(transaction -> {

                //ref to the supplier product in node 'users'
                DocumentReference supplierProductRef = FirebaseUtils
                        .getOneSupplierProduct( firestore, cartProduct.getSupplier(), cartProduct.getName())
                        .document("info");
                DocumentSnapshot supplierProductSnapshot = transaction.get(supplierProductRef).get();

                //ref to the product in node 'products'
                DocumentReference productsProductRef =
                        firestore.collection("products")
                                .document(cartProduct.getCategory())
                                .collection(cartProduct.getSupplier())
                                .document(cartProduct.getName());
//                DocumentSnapshot marketProductSnapshot = transaction.get(productsProductRef).get();

                Map<String, Object> transactionDetail = new HashMap<>();
                int supplierQuantity = Integer.parseInt(Objects.requireNonNull(supplierProductSnapshot.get("quantity")).toString());
                int requestQuantity = Integer.parseInt(cartProduct.getQuantity());
                int result =  supplierQuantity - requestQuantity;

                //if sufficient, update the supplier stock and the market
                if(result >= 0){
                    transaction.update(supplierProductRef, "quantity", String.valueOf(result));
                    transaction.update(productsProductRef, "quantity", String.valueOf(result));
                }
                else{
                    flag.set(false);
                    return "Fail";
                }

                //clear the cart, add to vendor stock
                //TODO: if the product already exists on the vendors onlineProduct, do update instead of add
                FirebaseProductServices firebaseProductServices = new FirebaseProductServices();
                RemoveFromCartRequest removeRequest =
                        new RemoveFromCartRequest(request.getEmail(), cartProduct.getName(), cartProduct.getSupplier());
                AddProductRequest addRequest =
                        new AddProductRequest(request.getEmail(), "Business owner", cartProduct.getName(),
                                cartProduct.getPrice(), cartProduct.getQuantity(), cartProduct.getDescription(),
                                cartProduct.getImageUrl(), cartProduct.getCategory(), cartProduct.getSupplier());
                removeFromCart(removeRequest);
                firebaseProductServices.addProduct(addRequest);

                return "Success";
            });
        }

        return flag.compareAndSet(true, true);
    }
}
