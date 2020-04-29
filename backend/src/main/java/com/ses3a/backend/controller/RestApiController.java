package com.ses3a.backend.controller;

import com.ses3a.backend.entity.object.SupplierProduct;
import com.ses3a.backend.entity.request.*;
import com.ses3a.backend.entity.response.*;
import com.ses3a.backend.firebase.FirebaseServices;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
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
    public ResponseEntity<GetUserInfoResponse>
    getUserInfo(@RequestHeader String email, @RequestHeader String role){
        System.out.println("RECEIVED GET USER INFO REQUEST");
        GetUserInfoRequest request = new GetUserInfoRequest(email, role);
        ResponseEntity<GetUserInfoResponse> responseEntity =
                new ResponseEntity<>(new GetUserInfoResponse(), HttpStatus.OK);
        try{
            Map<String, Object> userInfo = firebaseServices.getUserInfo(request);
            Objects.requireNonNull(responseEntity.getBody()).setStatus("Success");
            responseEntity.getBody().setEmail(userInfo.get("email").toString());
            responseEntity.getBody().setUsername(userInfo.get("username").toString());
        }
        catch (Exception e){
            e.printStackTrace();
        }
        return responseEntity;
    }


    @CrossOrigin(origins = "*")
    @PostMapping("/EditUserInfo")
    public ResponseEntity<EditUserInfoResponse>
    editUserInfo(@RequestBody EditUserInfoRequest editUserInfoRequest){
        System.out.println("RECEIVED EDIT USER INFO REQUEST");
        ResponseEntity<EditUserInfoResponse> responseEntity =
                new ResponseEntity<>(new EditUserInfoResponse(), HttpStatus.OK);
        firebaseServices.editUserInfo(editUserInfoRequest);
        Objects.requireNonNull(responseEntity.getBody()).setStatus("Success");
        responseEntity.getBody().setMessage("User info has been edited");
        return responseEntity;
    }


    @CrossOrigin(origins = "*")
    @GetMapping("/GetProductByCategory")
    public ResponseEntity<GetProductByCategoryResponse>
    getProductByCategory(@RequestHeader String email, @RequestHeader String category){
        System.out.println("RECEIVED GET PRODUCT BY CATEGORY REQUEST");
        GetProductByCategoryRequest request = new GetProductByCategoryRequest(email, category);
        ResponseEntity<GetProductByCategoryResponse> responseEntity =
                new ResponseEntity<>(new GetProductByCategoryResponse(), HttpStatus.OK);
        try{
            List<SupplierProduct> products = firebaseServices.getProductByCategory(request);
            Objects.requireNonNull(responseEntity.getBody()).setStatus("Success");
            responseEntity.getBody().setProducts(products);
        }
        catch (Exception e){
            e.printStackTrace();
        }
        return responseEntity;
    }


    @CrossOrigin(origins = "*")
    @GetMapping("/GetUserProduct")
    public ResponseEntity<GetUserProductResponse>
    getUserProducts(@RequestHeader String email, @RequestHeader String role){
        System.out.println("RECEIVED GET USER PRODUCT REQUEST");
        GetUserProductRequest request = new GetUserProductRequest(email, role);
        ResponseEntity<GetUserProductResponse> responseEntity =
                new ResponseEntity<>(new GetUserProductResponse(), HttpStatus.OK);
        try{
            List<Object> userProducts = firebaseServices.getUserProducts(request);
            Objects.requireNonNull(responseEntity.getBody()).setStatus("Success");
            responseEntity.getBody().setProducts(userProducts);
        }
        catch (Exception e){
            e.printStackTrace();
        }

        return responseEntity;
    }


    @CrossOrigin(origins = "*")
    @PostMapping("/AddProduct")
    public ResponseEntity<AddProductResponse>
    editUserInfo(@RequestBody AddProductRequest addProductRequest){
        System.out.println("RECEIVED ADD PRODUCT REQUEST");
        ResponseEntity<AddProductResponse> responseEntity =
                new ResponseEntity<>(new AddProductResponse(), HttpStatus.OK);
        firebaseServices.addProduct(addProductRequest);
        Objects.requireNonNull(responseEntity.getBody()).setStatus("Success");
        responseEntity.getBody().setMessage("Product has been added");
        return responseEntity;
    }


    @CrossOrigin(origins = "*")
    @PostMapping("/EditProduct")
    public ResponseEntity<EditProductResponse>
    editUserInfo(@RequestBody EditProductRequest editProductRequest){
        System.out.println("RECEIVED EDIT PRODUCT REQUEST");
        ResponseEntity<EditProductResponse> responseEntity =
                new ResponseEntity<>(new EditProductResponse(), HttpStatus.OK);
        firebaseServices.editProducts(editProductRequest);
        Objects.requireNonNull(responseEntity.getBody()).setStatus("Success");
        responseEntity.getBody().setMessage("Product info has been edited");
        return responseEntity;
    }

}