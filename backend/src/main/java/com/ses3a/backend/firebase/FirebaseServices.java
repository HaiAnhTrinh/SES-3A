package com.ses3a.backend.firebase;

import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.SetOptions;
import com.google.firebase.cloud.FirestoreClient;
import com.ses3a.backend.entity.request.CreateNewUserRequest;
import com.ses3a.backend.entity.request.EditUserInfoRequest;
import com.ses3a.backend.entity.request.GetUserInfoRequest;
import org.springframework.stereotype.Service;
import javax.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class FirebaseServices {

    //convert roles on the app into dtb user type
    private String convertToUserType(String role){
        if(role.equals("Business owner")){
            return "vendors";
        }
        return "suppliers";
    }

    //Add newly registered user to Firestore
    public void createNewUser(@NotNull CreateNewUserRequest request){
        Firestore firestore = FirestoreClient.getFirestore();
        Map<String, Object> data = new HashMap<>();
        data.put("email", request.getEmail());
        data.put("username", request.getUsername());
        String userType = convertToUserType(request.getRole());

        if(userType.equals("vendors")){
            FirestoreInitNewUser.initVendor(firestore, request.getEmail());
        }
        else{
            FirestoreInitNewUser.initSupplier(firestore, request.getEmail());
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
}
