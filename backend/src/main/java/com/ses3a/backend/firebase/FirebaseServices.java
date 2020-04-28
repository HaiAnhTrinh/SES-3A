package com.ses3a.backend.firebase;

import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.SetOptions;
import com.google.firebase.cloud.FirestoreClient;
import com.ses3a.backend.entity.object.SupplierProduct;
import com.ses3a.backend.entity.request.CreateNewUserRequest;
import com.ses3a.backend.entity.request.EditUserInfoRequest;
import com.ses3a.backend.entity.request.GetProductByCategoryRequest;
import com.ses3a.backend.entity.request.GetUserInfoRequest;
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
    //Get userInfo from Firestore
    public Map<String, Object> getUserInfo(@NotNull GetUserInfoRequest request) throws ExecutionException, InterruptedException {
        Firestore firestore = FirestoreClient.getFirestore();
        String userType = convertToUserType(request.getRole());

        return firestore.collection("users").document(userType)
                .collection(request.getEmail())
                .document("userInfo")
                .get()
                .get()
                .getData();
    }

    //Edit userInfo in Firestore
    public void editUserInfo(EditUserInfoRequest request) {
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
    public List<SupplierProduct> getProductByCategory(GetProductByCategoryRequest request)
            throws ExecutionException, InterruptedException {
        Firestore firestore = FirestoreClient.getFirestore();
        Iterable<CollectionReference> collectionRefs =
                firestore.collection("products")
                        .document(request.getCategory())
                        .listCollections();
        List<SupplierProduct> products = new ArrayList<>();

        for(CollectionReference ref : collectionRefs){
            List<QueryDocumentSnapshot> documents =
                    ref.get().get().getDocuments();

            for(QueryDocumentSnapshot document : documents){
                SupplierProduct product = new SupplierProduct();
                product.setSupplierEmail(ref.getId());
                product.setProductName(document.getId());
                product.setProductPrice(document.getString("price"));
                product.setProductQuantity(document.getString("quantity"));
                products.add(product);
            }
        }
        return products;
    }

    //Add and edit products in Firestore
    public void addAndEditProducts(){

    }
}
