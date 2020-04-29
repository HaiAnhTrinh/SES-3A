package com.ses3a.backend.firebase;

import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.SetOptions;
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

        firestore.collection("users")
                .document(userType)
                .collection(request.getEmail())
                .document("userInfo")
                .set(data);
    }

    /*******************************************prototype functions****************************************************/
    //Get user info from Firestore
    public Map<String, Object> getUserInfo(@NotNull GetUserInfoRequest request)
            throws ExecutionException, InterruptedException {
        Firestore firestore = FirestoreClient.getFirestore();
        String userType = convertToUserType(request.getRole());

        return firestore.collection("users").document(userType)
                .collection(request.getEmail())
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

        firestore.collection("users")
                .document(userType)
                .collection(request.getEmail())
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


    //Get user products from Firestore
    public List<Object> getUserProducts(@NotNull GetUserProductRequest request)
            throws ExecutionException, InterruptedException {
        Firestore firestore = FirestoreClient.getFirestore();
        String userType = convertToUserType(request.getRole());

        Iterable<CollectionReference> collectionRefs =
                firestore.collection("users")
                        .document(userType)
                        .collection(request.getEmail())
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


    //Edit products in Firestore
    //Need to edit to 'products/categories/email' and 'users/suppliers/email/products'
    public void editProducts(@NotNull EditProductRequest request){
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

        firestore.collection("users")
                .document(userType)
                .collection(request.getEmail())
                .document("products")
                .collection(request.getName())
                .document("info")
                .set(data, SetOptions.merge());
    }


    //Add products in Firestore
    //Need to add to 'products/categories/email' and 'users/suppliers/email/products' for suppliers only
    public void addProduct(@NotNull AddProductRequest request){
        Firestore firestore = FirestoreClient.getFirestore();
        Map<String, Object> data = new HashMap<>();
        String userType = convertToUserType(request.getRole());

        if(userType.equals("suppliers")){
            data.put("name", request.getName());
            data.put("price", request.getPrice());
            data.put("quantity", request.getQuantity());

            //products branch is only for suppliers' products
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

        //common case for both user types
        firestore.collection("users")
                .document(userType)
                .collection(request.getEmail())
                .document("products")
                .collection(request.getName())
                .document("info")
                .set(data, SetOptions.merge());
    }

}
