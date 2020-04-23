package com.ses3a.backend.controller;

import com.ses3a.backend.entity.request.CreateNewUserRequest;
import com.ses3a.backend.entity.request.EditUserInfoRequest;
import com.ses3a.backend.entity.request.GetUserInfoRequest;
import com.ses3a.backend.entity.response.CreateNewUserResponse;
import com.ses3a.backend.entity.response.EditUserInfoResponse;
import com.ses3a.backend.entity.response.GetUserInfoResponse;
import com.ses3a.backend.firebase.FirebaseServices;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Objects;

@RestController
public class RestApiController {
    final FirebaseServices firebaseServices;

    public RestApiController(FirebaseServices firebaseServices) {
        this.firebaseServices = firebaseServices;
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/CreateNewUser")
    public ResponseEntity<CreateNewUserResponse> createNewUser(@RequestBody CreateNewUserRequest createNewUserRequest){
        System.out.println("RECEIVED CREATE NEW USER REQUEST");
        ResponseEntity<CreateNewUserResponse> responseEntity =
                new ResponseEntity<>(new CreateNewUserResponse(), HttpStatus.OK);
        firebaseServices.createNewUser(createNewUserRequest);
        Objects.requireNonNull(responseEntity.getBody()).setStatus("Success");
        responseEntity.getBody().setMessage("Register successful. Please verify your email.");
        return responseEntity;
    }

    /*******************************************prototype functions****************************************************/
    @CrossOrigin(origins = "*")
    @GetMapping("/GetUserInfo")
    public ResponseEntity<GetUserInfoResponse> getUserInfo(@RequestHeader String email, @RequestHeader String role){
        System.out.println("RECEIVED GET USER INFO REQUEST");
        GetUserInfoRequest request = new GetUserInfoRequest(email, role);
        ResponseEntity<GetUserInfoResponse> responseEntity =
                new ResponseEntity<>(new GetUserInfoResponse(), HttpStatus.OK);
        try{
            Map<String, Object> userInfo = firebaseServices.getUserInfo(request);
            Objects.requireNonNull(responseEntity.getBody()).setEmail(userInfo.get("email").toString());
            responseEntity.getBody().setUsername(userInfo.get("username").toString());
        }
        catch (Exception e){
            e.printStackTrace();
        }
        return responseEntity;
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/EditUserInfo")
    public ResponseEntity<EditUserInfoResponse> editUserInfo(@RequestBody EditUserInfoRequest editUserInfoRequest){
        System.out.println("RECEIVED EDIT USER INFO REQUEST");
        ResponseEntity<EditUserInfoResponse> responseEntity =
                new ResponseEntity<>(new EditUserInfoResponse(), HttpStatus.OK);
        firebaseServices.editUserInfo(editUserInfoRequest);
        Objects.requireNonNull(responseEntity.getBody()).setStatus("Success");
        responseEntity.getBody().setMessage("User info has been edited");
        return responseEntity;
    }
}