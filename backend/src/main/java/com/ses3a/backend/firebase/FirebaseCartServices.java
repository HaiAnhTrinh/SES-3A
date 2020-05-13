package com.ses3a.backend.firebase;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.ses3a.backend.entity.object.CartProduct;
import com.ses3a.backend.entity.request.AddToCartRequest;
import com.ses3a.backend.entity.request.GetCartRequest;
import com.ses3a.backend.entity.request.PurchaseRequest;
import com.ses3a.backend.entity.request.RemoveFromCartRequest;
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
            double cost = Double.parseDouble(price) * Integer.parseInt(quantity);

            product.setName(data.get("name").toString());
            product.setPrice(price);
            product.setQuantity(quantity);
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

        //init the transaction
        ApiFuture<String> futureTransaction = firestore.runTransaction(transaction -> {
            List<Map<String, Object>> transactionList = new LinkedList<>();

            //init the purchase details
            for (CartProduct cartProduct: request.getCartProducts()) {

                //ref to the product in node 'users'
                DocumentReference usersProductRef = FirebaseUtils
                        .getOneProduct(
                                firestore, "suppliers",
                                cartProduct.getSupplier(), cartProduct.getName()
                        )
                        .document("info");
                DocumentSnapshot snapshot = transaction.get(usersProductRef).get();
                //ref to the product in node 'products'
                DocumentReference productsProductRef =
                        firestore.collection("products")
                                .document(cartProduct.getCategory())
                                .collection(cartProduct.getSupplier())
                                .document(cartProduct.getName());

                Map<String, Object> transactionDetail = new HashMap<>();
                int supplierQuantity = Integer.parseInt(Objects.requireNonNull(snapshot.get("quantity")).toString());
                int requestQuantity = Integer.parseInt(cartProduct.getQuantity());
                int result =  supplierQuantity - requestQuantity;

                if(result >= 0){
                    transactionDetail.put("usersProductRef", usersProductRef);
                    transactionDetail.put("productsProductRef", productsProductRef);
                    transactionDetail.put("field", "quantity");
                    transactionDetail.put("result", String.valueOf(result));
                }
                else{
                    flag.set(false);
                    return "Fail";
                }
                transactionList.add(transactionDetail);
            }

            //loop through all products in the transaction
            for (int i = 0; i < transactionList.size(); i++) {
                //update the market
                transaction.update(
                        (DocumentReference) transactionList.get(i).get("cartProductRef"),
                        transactionList.get(i).get("field").toString(),
                        transactionList.get(i).get("result")
                );
                //update the supplier stock
                transaction.update(
                        (DocumentReference) transactionList.get(i).get("usersProductRef"),
                        transactionList.get(i).get("field").toString(),
                        transactionList.get(i).get("result")
                );
            }

            //clear the cart
            System.out.println("request email: " + request.getEmail());
            for(CartProduct cartProduct: request.getCartProducts()){
                RemoveFromCartRequest removeRequest =
                        new RemoveFromCartRequest(request.getEmail(), cartProduct.getName(), cartProduct.getSupplier());
                removeFromCart(removeRequest);
            }


            return "Success";
        });
        System.out.println("futureTransaction: " + futureTransaction);
        return flag.compareAndSet(true, true);
    }
}
