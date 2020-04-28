package com.ses3a.backend.firebase;

import com.google.cloud.firestore.Firestore;
import com.ses3a.backend.entity.request.CreateNewUserRequest;

import java.util.HashMap;
import java.util.Map;

public class FirestoreInitNewUser {

    //TODO: if the final product does not require difference, merge them into 1

    protected static void initVendor(Firestore firestore, CreateNewUserRequest request){
        System.out.println("INIT VENDORS CALLED");
        Map<String, Object> emptyData = new HashMap<>();
        firestore.collection("users")
                .document(FirebaseUtils.convertToUserType(request.getRole()))
                .collection(request.getEmail())
                .document("products")
                .collection("inStore")
                .document("nothing").set(emptyData);
    }

    protected static void initSupplier(Firestore firestore, CreateNewUserRequest request){
        System.out.println("INIT SUPPLIERS CALLED");
        Map<String, Object> emptyData = new HashMap<>();
        firestore.collection("users")
                .document(FirebaseUtils.convertToUserType(request.getRole()))
                .collection(request.getEmail())
                .document("products")
                .collection("inStore")
                .document("nothing").set(emptyData);
    }
}
