package com.ses3a.backend.controller;

import com.ses3a.backend.entity.CreateNewUserRequest;
import com.ses3a.backend.entity.CreateNewUserResponse;
import com.ses3a.backend.firebase.FirebaseServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RestApiController {
    @Autowired
    FirebaseServices firebaseServices;

//    @CrossOrigin(origins = "*")
//    @GetMapping("/Login")
//    public ResponseEntity<LoginResponse> login(@RequestHeader String username, @RequestHeader String password){
//        System.out.println("RECEIVED LOGIN REQUEST");
//        ResponseEntity<LoginResponse> responseEntity = new ResponseEntity<LoginResponse>(new LoginResponse(""), HttpStatus.OK);
//        if(username.equals("haianh") && password.equals("123456")){
//            Objects.requireNonNull(responseEntity.getBody()).setStatus("Success");
//        }
//        else{
//            Objects.requireNonNull(responseEntity.getBody()).setStatus("Fail");
//        }
//        return responseEntity;
//    }

    @CrossOrigin(origins = "*")
    @PostMapping("/CreateNewUser")
    public ResponseEntity<CreateNewUserResponse> createNewUser(@RequestBody CreateNewUserRequest createNewUserRequest){
        System.out.println("RECEIVED CREATE NEW USER REQUEST");
        ResponseEntity<CreateNewUserResponse> responseEntity = new ResponseEntity<>(new CreateNewUserResponse("", ""), HttpStatus.OK);
        firebaseServices.createNewUser(createNewUserRequest);
        responseEntity.getBody().setStatus("Success");
        responseEntity.getBody().setMessage("Register successful. Please verify your email.");
        return responseEntity;
    }
}