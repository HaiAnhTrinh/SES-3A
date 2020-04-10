package com.ses3a.backend.firebase;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.cloud.FirestoreClient;
import com.ses3a.backend.entity.CreateNewUserRequest;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class FirebaseServices {

    public FirebaseServices() {
    }

    //Add newly registered user to Firestore
    public void createNewUser(CreateNewUserRequest request){
        Firestore firestore = FirestoreClient.getFirestore();
        Map<String, Object> data = new HashMap<>();
        data.put("email", request.getEmail());
        data.put("username", request.getUsername());
        if(request.getRole().equals("Business owner")){
            firestore.collection("users").document("vendors").collection(request.getEmail()).document("userInfo").set(data);
        }
        else{
            firestore.collection("users").document("suppliers").collection(request.getEmail()).document("userInfo").set(data);
        }
    }
}
