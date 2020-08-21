package com.ses3a.backend.firebase;

import com.google.cloud.firestore.Firestore;
import com.ses3a.backend.Configs;
import com.ses3a.backend.entity.request.CreateNewUserRequest;

import java.util.HashMap;
import java.util.Map;

public class FirestoreInitNewUser {

    protected static void initVendor(Firestore firestore, CreateNewUserRequest request) {
        System.out.println("INIT VENDORS CALLED");
        Map<String, Object> emptyData = new HashMap<>();
        firestore.collection(Configs.USERS_COLLECTION)
                .document(FirebaseUtils.convertToUserType(request.getRole()))
                .collection(request.getEmail())
                .document("products")
                .create(emptyData);
        firestore.collection(Configs.USERS_COLLECTION)
                .document(FirebaseUtils.convertToUserType(request.getRole()))
                .collection(request.getEmail())
                .document("onlineProducts")
                .create(emptyData);
        firestore.collection(Configs.CARTS_COLLECTION)
                .document(request.getEmail())
                .create(emptyData);
        firestore.collection(Configs.VENDOR_PURCHASES_COLLECTION)
                .document(request.getEmail())
                .create(emptyData);
    }

    protected static void initSupplier(Firestore firestore, CreateNewUserRequest request) {
        System.out.println("INIT SUPPLIERS CALLED");
        Map<String, Object> emptyData = new HashMap<>();
        firestore.collection(Configs.USERS_COLLECTION)
                .document(FirebaseUtils.convertToUserType(request.getRole()))
                .collection(request.getEmail())
                .document("products")
                .create(emptyData);
        firestore.collection(Configs.REVENUE_COLLECTION)
                .document(request.getEmail())
                .create(emptyData);
        firestore.collection(Configs.SUPPLIER_PURCHASES_COLLECTION)
                .document(request.getEmail())
                .collection("pendingPurchases")
                .add(emptyData);
        firestore.collection(Configs.SUPPLIER_PURCHASES_COLLECTION)
                .document(request.getEmail())
                .collection("deliveredPurchases")
                .add(emptyData);
    }
}
