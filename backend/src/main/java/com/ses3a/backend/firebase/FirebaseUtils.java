package com.ses3a.backend.firebase;

import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;

public class FirebaseUtils {

    //convert roles on the app into dtb user type
    protected static String convertToUserType(String role){
        if(role.equals("Business owner")){
            return "vendors";
        }
        return "suppliers";
    }

    //Get the collection of a user: node 'users'
    protected static CollectionReference getUserCollection(Firestore firestore, String userType, String email){
        return firestore.collection("users")
                .document(userType)
                .collection(email);
    }

    //Get the collection of a product: node 'users'
    protected static CollectionReference getOneProduct(Firestore firestore, String userType, String email, String name){
        return getUserCollection(firestore, userType, email)
                .document("products")
                .collection(name);
    }

}
