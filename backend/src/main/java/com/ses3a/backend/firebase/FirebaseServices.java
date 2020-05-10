package com.ses3a.backend.firebase;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.ses3a.backend.entity.object.SupplierProduct;
import com.ses3a.backend.entity.object.VendorProduct;
import com.ses3a.backend.entity.request.*;
import org.springframework.stereotype.Service;
import javax.validation.constraints.NotNull;
import java.util.*;
import java.util.concurrent.ExecutionException;

import static com.ses3a.backend.firebase.FirebaseUtils.convertToUserType;

@Service
public class FirebaseServices {

    //Add newly registered user to Firestore
    public void createNewUser(@NotNull CreateNewUserRequest request){
        Firestore firestore = FirestoreClient.getFirestore();
        Map<String, Object> data = new HashMap<>();
        data.put("email", request.getEmail());
        data.put("username", request.getUsername());
        String userType = convertToUserType(request.getRole());

        if(userType.equals("vendors")){
            FirestoreInitNewUser.initVendor(firestore, request);
        }
        else{
            FirestoreInitNewUser.initSupplier(firestore, request);
        }

        FirebaseUtils.getUserCollection(firestore, userType, request.getEmail())
                .document("userInfo")
                .set(data);
    }


    //Authorisation layer
    //Return true if the account belongs to that user type
    public Boolean authorize(String email, String role) {

        Firestore firestore = FirestoreClient.getFirestore();
        String userType = convertToUserType(role);
        try{
            System.out.println("LOGIN: " + FirebaseUtils.getUserCollection(firestore, userType, email).get().get().isEmpty());
            return !FirebaseUtils.getUserCollection(firestore, userType, email).get().get().isEmpty();
        }
        catch (Exception e){
            e.printStackTrace();
        }
        return false;
    }

    /*******************************************prototype functions****************************************************/
    //Get user info from Firestore
    public Map<String, Object> getUserInfo(@NotNull GetUserInfoRequest request)
            throws ExecutionException, InterruptedException {
        Firestore firestore = FirestoreClient.getFirestore();
        String userType = convertToUserType(request.getRole());

        return FirebaseUtils.getUserCollection(firestore, userType, request.getEmail())
                .document("userInfo")
                .get()
                .get()
                .getData();
    }


    //Edit user info in Firestore
    public void editUserInfo(@NotNull EditUserInfoRequest request) {
        Firestore firestore = FirestoreClient.getFirestore();
        Map<String, Object> data = new HashMap<>();
        data.put("username", request.getUsername());
        String userType = convertToUserType(request.getRole());

        FirebaseUtils.getUserCollection(firestore, userType, request.getEmail())
                .document("userInfo")
                .set(data, SetOptions.merge());
    }


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

        Iterable<CollectionReference> collectionRefs =
                FirebaseUtils.getUserCollection(firestore, userType, request.getEmail())
                        .document("products")
                        .listCollections();
        List<Object> products = new ArrayList<>();

        if(userType.equals("vendors")){
            //Iterate through all vendors' products
            for(CollectionReference ref : collectionRefs){
                Map<String, Object> data = ref.document("info").get().get().getData();
                VendorProduct product = new VendorProduct();
                product.setProductName(data.get("name").toString());
                product.setProductQuantity(data.get("quantity").toString());
                products.add(product);
            }
        }
        else {
            //Iterate through all suppliers' products
            for(CollectionReference ref : collectionRefs){
                Map<String, Object> data = ref.document("info").get().get().getData();
                SupplierProduct product = new SupplierProduct();
                product.setProductName(data.get("name").toString());
                product.setProductPrice(data.get("price").toString());
                product.setProductQuantity(data.get("quantity").toString());
                products.add(product);
            }
        }
        return products;
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

        if(userType.equals("vendors")){
            data.put("name", request.getName());
            data.put("quantity", request.getQuantity());
        }
        else {
            data.put("name", request.getName());
            data.put("price", request.getPrice());
            data.put("quantity", request.getQuantity());

            firestore.collection("products")
                    .document(request.getCategory())
                    .collection(request.getEmail())
                    .document(request.getName())
                    .set(data, SetOptions.merge());
        }

        FirebaseUtils.getOneProduct(firestore, userType, request.getEmail(), request.getName())
                .document("info")
                .set(data, SetOptions.merge());
    }


    //Add products in Firestore
    //Vendors: add to node 'users'
    //Suppliers: add to node 'users' and 'products'
    public void addProduct(@NotNull AddProductRequest request){
        Firestore firestore = FirestoreClient.getFirestore();
        Map<String, Object> data = new HashMap<>();
        String userType = convertToUserType(request.getRole());

        if(userType.equals("suppliers")){
            data.put("name", request.getName());
            data.put("price", request.getPrice());
            data.put("quantity", request.getQuantity());

            //add to node 'products'
            firestore.collection("products")
                    .document(request.getCategory())
                    .collection(request.getEmail())
                    .document(request.getName())
                    .set(data, SetOptions.merge());
        }
        else {
            data.put("name", request.getName());
            data.put("quantity", request.getQuantity());
        }

        //add to node 'users'
        FirebaseUtils.getOneProduct(firestore, userType, request.getEmail(), request.getName())
                .document("info")
                .set(data, SetOptions.merge());
    }


    //Delete the product of a user
    //For suppliers: delete the product in node 'users' and 'products'
    //For vendors: delete the product in node 'users'
    public void deleteProduct(@NotNull DeleteProductRequest request) {
        Firestore firestore = FirestoreClient.getFirestore();
        String userType = convertToUserType(request.getRole());

        if(userType.equals("suppliers")){
            firestore.collection("products")
                    .document(request.getCategory())
                    .collection(request.getEmail())
                    .document(request.getName())
                    .delete();
        }

        try{
            ApiFuture<QuerySnapshot> future =
                    FirebaseUtils.getOneProduct(firestore, userType, request.getEmail(), request.getName()).get();
            // future.get() blocks on document retrieval
            List<QueryDocumentSnapshot> documents = future.get().getDocuments();
            for (QueryDocumentSnapshot document : documents) {
                document.getReference().delete();
            }
        }
        catch (Exception e) {
            System.err.println("Error deleting collection : " + e.getMessage());
        }

    }

}
