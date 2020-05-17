package com.ses3a.backend.firebase;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.ses3a.backend.entity.object.SupplierProduct;
import com.ses3a.backend.entity.object.VendorProduct;
import com.ses3a.backend.entity.request.*;
import org.springframework.stereotype.Service;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import static com.ses3a.backend.firebase.FirebaseUtils.convertToUserType;

@Service
public class FirebaseProductServices {

    //Get products by category in Firestore
    public List<SupplierProduct> getProductByCategory(@NotNull GetProductByCategoryRequest request)
            throws ExecutionException, InterruptedException {
        Firestore firestore = FirestoreClient.getFirestore();
        Iterable<CollectionReference> collectionRefs =
                firestore.collection("products")
                        .document(request.getCategory())
                        .listCollections();
        List<SupplierProduct> products = new ArrayList<>();

        //Iterate through all products
        for(CollectionReference ref : collectionRefs){
            List<QueryDocumentSnapshot> documents =
                    ref.get().get().getDocuments();

            for(QueryDocumentSnapshot document : documents){
                SupplierProduct product = new SupplierProduct();
                product.setSupplierEmail(ref.getId());
                product.setProductName(document.getString("name"));
                product.setProductPrice(document.getString("price"));
                product.setProductQuantity(document.getString("quantity"));
                products.add(product);
            }
        }
        return products;
    }


    //Get the products belong to a user from Firestore
    public List<Object> getUserProducts(@NotNull GetUserProductRequest request)
            throws ExecutionException, InterruptedException {
        Firestore firestore = FirestoreClient.getFirestore();
        String userType = convertToUserType(request.getRole());

        Iterable<CollectionReference> productRefs =
                FirebaseUtils.getUserCollection(firestore, userType, request.getEmail())
                        .document("products")
                        .listCollections();
        Iterable<CollectionReference> onlineProductRefs =
                FirebaseUtils.getUserCollection(firestore, userType, request.getEmail())
                        .document("onlineProducts")
                        .listCollections();
        List<Object> products = new ArrayList<>();

        if(userType.equals("vendors")){
            initGetUserProductResponse(onlineProductRefs, products);
        }

        initGetUserProductResponse(productRefs, products);

        return products;
    }

    //support getUserProducts
    private void initGetUserProductResponse(Iterable<CollectionReference> onlineProductRefs, List<Object> products)
            throws InterruptedException, ExecutionException {
        for(CollectionReference ref : onlineProductRefs){
            Map<String, Object> data = ref.document("info").get().get().getData();
            SupplierProduct product = new SupplierProduct();
            product.setSupplierEmail(data.get("supplier").toString());
            product.setProductName(data.get("name").toString());
            product.setProductPrice(data.get("price").toString());
            product.setProductQuantity(data.get("quantity").toString());
            product.setProductCategory(data.get("category").toString());
            products.add(product);
        }
    }


    //TODO: improve editProduct 2,3,4
    //Edit products in Firestore
    //1. Need to edit to 'products/categories/email' and 'users/suppliers/email/products' for supplier
    //2. Suppliers can change any info except for name and category
    //3. BO can change everything they manually added
    //4. BO can only change the quantity if they got the products from the website
    public void editProduct(@NotNull EditProductRequest request){
        Firestore firestore = FirestoreClient.getFirestore();
        Map<String, Object> data = new HashMap<>();
        String userType = convertToUserType(request.getRole());

        data.put("name", request.getName());
        data.put("quantity", request.getQuantity());
        data.put("supplier", request.getSupplier());
        data.put("price", request.getPrice());

        if(userType.equals("vendors")){

            FirebaseUtils.getOneVendorProduct(firestore, request.getEmail(), request.getName(), request.getSupplier())
                    .document("info")
                    .set(data, SetOptions.merge());
        }
        else {
            //edit in the market
            firestore.collection("products")
                    .document(request.getCategory())
                    .collection(request.getEmail())
                    .document(request.getName())
                    .set(data, SetOptions.merge());

            //edit in supplier's stock
            FirebaseUtils.getOneSupplierProduct(firestore, request.getEmail(), request.getName())
                    .document("info")
                    .set(data, SetOptions.merge());
        }
    }


    //Add products in Firestore
    //Vendors: add to node 'users'
    //Suppliers: add to node 'users' and 'products'
    public void addProduct(@NotNull AddProductRequest request){
        Firestore firestore = FirestoreClient.getFirestore();
        Map<String, Object> data = new HashMap<>();
        String userType = convertToUserType(request.getRole());

        data.put("name", request.getName());
        data.put("price", request.getPrice());
        data.put("quantity", request.getQuantity());
        data.put("supplier", request.getSupplier());
        data.put("category", request.getCategory());

        if(userType.equals("suppliers")){
            //add to market
            firestore.collection("products")
                    .document(request.getCategory())
                    .collection(request.getEmail())
                    .document(request.getName())
                    .set(data);

            //add to supplier's stock
            FirebaseUtils.getOneSupplierProduct(firestore, request.getEmail(), request.getName())
                    .document("info")
                    .set(data);
        }
        else {
            //add to vendor's stock
            FirebaseUtils.getOneVendorProduct(firestore, request.getEmail(), request.getName(), request.getSupplier())
                    .document("info")
                    .set(data);
        }
    }


    //Delete the product of a user
    //For suppliers: delete the product in node 'users' and 'products'
    //For vendors: delete the product in node 'users'
    public void deleteProduct(@NotNull DeleteProductRequest request) {
        Firestore firestore = FirestoreClient.getFirestore();
        String userType = convertToUserType(request.getRole());
        ApiFuture<QuerySnapshot> future;

        if(userType.equals("suppliers")){
            firestore.collection("products")
                    .document(request.getCategory())
                    .collection(request.getEmail())
                    .document(request.getName())
                    .delete();
            future = FirebaseUtils.getOneSupplierProduct(firestore, request.getEmail(), request.getName()).get();
        }
        else{
            future = FirebaseUtils
                    .getOneVendorProduct(firestore, request.getEmail(), request.getName(), request.getSupplier())
                    .get();
        }

        try{
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

}
