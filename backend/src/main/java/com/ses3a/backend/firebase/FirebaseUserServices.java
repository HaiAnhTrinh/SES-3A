package com.ses3a.backend.firebase;

import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.SetOptions;
import com.google.firebase.cloud.FirestoreClient;
import com.ses3a.backend.Configs;
import com.ses3a.backend.entity.object.GraphData;
import com.ses3a.backend.entity.request.CreateNewUserRequest;
import com.ses3a.backend.entity.request.EditUserInfoRequest;
import com.ses3a.backend.entity.request.GetUserInfoRequest;
import org.springframework.stereotype.Service;

import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import static com.ses3a.backend.firebase.FirebaseUtils.convertToUserType;

@Service
public class FirebaseUserServices {

    //Add newly registered user to Firestore
    public void createNewUser(@NotNull CreateNewUserRequest request) {
        Firestore firestore = FirestoreClient.getFirestore();
        Map<String, Object> data = new HashMap<>();
        data.put("email", request.getEmail());
        data.put("username", request.getUsername());
        data.put("address", "");
        data.put("phone", "");
        String userType = convertToUserType(request.getRole());

        if (userType.equals(Configs.VENDOR_TYPE)) {
            FirestoreInitNewUser.initVendor(firestore, request);
        } else {
            FirestoreInitNewUser.initSupplier(firestore, request);
        }

        FirebaseUtils.getUserCollection(firestore, userType, request.getEmail())
                .document(Configs.USER_INFO)
                .set(data);
    }

    //Authorisation layer
    //Return true if the account belongs to that user type
    public Boolean authorize(String email, String role) {

        Firestore firestore = FirestoreClient.getFirestore();
        String userType = convertToUserType(role);
        try {
            System.out.println("LOGIN: " + FirebaseUtils.getUserCollection(firestore, userType, email).get().get().isEmpty());
            return !FirebaseUtils.getUserCollection(firestore, userType, email).get().get().isEmpty();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    //Get user info from Firestore
    public Map<String, Object> getUserInfo(@NotNull GetUserInfoRequest request)
            throws ExecutionException, InterruptedException {
        Firestore firestore = FirestoreClient.getFirestore();
        String userType = convertToUserType(request.getRole());

        return FirebaseUtils.getUserCollection(firestore, userType, request.getEmail())
                .document(Configs.USER_INFO)
                .get()
                .get()
                .getData();
    }

    //Edit user info in Firestore
    public void editUserInfo(@NotNull EditUserInfoRequest request) {
        Firestore firestore = FirestoreClient.getFirestore();
        Map<String, Object> data = new HashMap<>();
        data.put("username", request.getUsername());
        data.put("address", request.getAddress());
        data.put("phone", request.getPhone());
        String userType = convertToUserType(request.getRole());

        FirebaseUtils.getUserCollection(firestore, userType, request.getEmail())
                .document(Configs.USER_INFO)
                .set(data, SetOptions.merge());
    }

    //Get supplier revenue data
    public List<GraphData> getGraphData(String email) {
        Firestore firestore = FirestoreClient.getFirestore();
        List<GraphData> graphData = new ArrayList<>();

        try{
            firestore.collection(Configs.REVENUE_COLLECTION).document(email).get().get().getData()
                    .forEach((k, v) -> {
                        graphData.add(new GraphData(k, v.toString()));
                    });
        }
        catch (Exception e){
            e.printStackTrace();
        }

        return graphData;
    }

}
