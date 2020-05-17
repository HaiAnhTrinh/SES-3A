package com.ses3a.backend.controller;

import com.ses3a.backend.entity.object.CartProduct;
import com.ses3a.backend.entity.object.SupplierProduct;
import com.ses3a.backend.entity.request.*;
import com.ses3a.backend.entity.response.*;
import com.ses3a.backend.firebase.FirebaseCartServices;
import com.ses3a.backend.firebase.FirebaseUserServices;
import com.ses3a.backend.firebase.FirebaseProductServices;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
public class RestApiController {
    final FirebaseUserServices firebaseUserServices;
    final FirebaseProductServices firebaseProductServices;
    final FirebaseCartServices firebaseCartServices;

    public RestApiController(FirebaseUserServices firebaseUserServices,
                             FirebaseProductServices firebaseProductServices,
                             FirebaseCartServices firebaseCartServices) {
        this.firebaseUserServices = firebaseUserServices;
        this.firebaseProductServices = firebaseProductServices;
        this.firebaseCartServices = firebaseCartServices;
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/CreateNewUser")
    public ResponseEntity<CreateNewUserResponse> createNewUser(@RequestBody CreateNewUserRequest createNewUserRequest){
        System.out.println("RECEIVED CREATE NEW USER REQUEST");
        ResponseEntity<CreateNewUserResponse> responseEntity =
                new ResponseEntity<>(new CreateNewUserResponse(), HttpStatus.OK);
        firebaseUserServices.createNewUser(createNewUserRequest);
        Objects.requireNonNull(responseEntity.getBody()).setStatus("Success");
        responseEntity.getBody().setMessage("Register successful. Please verify your email.");
        return responseEntity;
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/Login")
    public ResponseEntity<Map<String, Boolean>> Login(@RequestHeader String email, @RequestHeader String role){
        System.out.println("RECEIVED LOGIN REQUEST");
        Map<String, Boolean> data = new HashMap<>();
        data.put("isAuthorized", firebaseUserServices.authorize(email, role));
        ResponseEntity<Map<String, Boolean>> responseEntity =
                new ResponseEntity<>(data, HttpStatus.OK);
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
            Map<String, Object> userInfo = firebaseUserServices.getUserInfo(request);
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
        firebaseUserServices.editUserInfo(editUserInfoRequest);
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
            List<SupplierProduct> products = firebaseProductServices.getProductByCategory(request);
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
            List<Object> userProducts = firebaseProductServices.getUserProducts(request);
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
    addProduct(@RequestBody AddProductRequest addProductRequest){
        System.out.println("RECEIVED ADD PRODUCT REQUEST");
        ResponseEntity<AddProductResponse> responseEntity =
                new ResponseEntity<>(new AddProductResponse(), HttpStatus.OK);
        firebaseProductServices.addProduct(addProductRequest);
        Objects.requireNonNull(responseEntity.getBody()).setStatus("Success");
        responseEntity.getBody().setMessage("Product has been added");
        return responseEntity;
    }


    @CrossOrigin(origins = "*")
    @PostMapping("/EditProduct")
    public ResponseEntity<EditProductResponse>
    editProduct(@RequestBody EditProductRequest editProductRequest){
        System.out.println("RECEIVED EDIT PRODUCT REQUEST");
        ResponseEntity<EditProductResponse> responseEntity =
                new ResponseEntity<>(new EditProductResponse(), HttpStatus.OK);
        firebaseProductServices.editProduct(editProductRequest);
        Objects.requireNonNull(responseEntity.getBody()).setStatus("Success");
        responseEntity.getBody().setMessage("Product info has been edited");
        return responseEntity;
    }


    @CrossOrigin(origins = "*")
    @PostMapping("/DeleteProduct")
    public ResponseEntity<DeleteProductResponse>
    deleteProduct(@RequestBody DeleteProductRequest deleteProductRequest){
        System.out.println("RECEIVED DELETE PRODUCT REQUEST");
        ResponseEntity<DeleteProductResponse> responseEntity =
                new ResponseEntity<>(new DeleteProductResponse(), HttpStatus.OK);
        firebaseProductServices.deleteProduct(deleteProductRequest);
        Objects.requireNonNull(responseEntity.getBody()).setStatus("Success");
        responseEntity.getBody().setMessage("Product has been deleted");
        return responseEntity;
    }


    @CrossOrigin(origins = "*")
    @PostMapping("/AddToCart")
    public ResponseEntity<AddToCartResponse>
    addToCart(@RequestBody AddToCartRequest addToCartRequest){
        System.out.println("RECEIVED ADD TO CART REQUEST");
        ResponseEntity<AddToCartResponse> responseEntity =
                new ResponseEntity<>(new AddToCartResponse(), HttpStatus.OK);
        firebaseCartServices.addToCart(addToCartRequest);
        Objects.requireNonNull(responseEntity.getBody()).setStatus("Success");
        responseEntity.getBody().setMessage("Product has been added to your cart");
        return responseEntity;
    }


    @CrossOrigin(origins = "*")
    @GetMapping("GetCart")
    public ResponseEntity<GetCartResponse>
    getCart(@RequestHeader String email){
        System.out.println("RECEIVED GET CART REQUEST");
        GetCartRequest request = new GetCartRequest(email);
        ResponseEntity<GetCartResponse> responseEntity =
                new ResponseEntity<>(new GetCartResponse(), HttpStatus.OK);
        try{
            List<CartProduct> cartProducts = firebaseCartServices.getCartProduct(request);
            Objects.requireNonNull(responseEntity.getBody()).setStatus("Success");
            responseEntity.getBody().setCartProducts(cartProducts);
        }
        catch (Exception e){
            e.printStackTrace();
        }

        return responseEntity;
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/RemoveFromCart")
    public ResponseEntity<RemoveFromCartResponse>
    removeFromCart(@RequestBody RemoveFromCartRequest removeFromCartRequest){
        System.out.println("RECEIVED REMOVE FROM CART REQUEST");
        ResponseEntity<RemoveFromCartResponse> responseEntity =
                new ResponseEntity<>(new RemoveFromCartResponse(), HttpStatus.OK);
        firebaseCartServices.removeFromCart(removeFromCartRequest);
        Objects.requireNonNull(responseEntity.getBody()).setStatus("Success");
        responseEntity.getBody().setMessage("Product has been removed from your cart");
        return responseEntity;
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/Purchase")
    public ResponseEntity<PurchaseResponse>
    purchase(@RequestBody PurchaseRequest purchaseRequest){
        System.out.println("RECEIVED PURCHASE REQUEST");
        ResponseEntity<PurchaseResponse> responseEntity =
                new ResponseEntity<>(new PurchaseResponse(), HttpStatus.OK);
        if(firebaseCartServices.purchase(purchaseRequest)){
            Objects.requireNonNull(responseEntity.getBody()).setStatus("Success");
            responseEntity.getBody().setMessage("Product has been successfully purchased");
        }
        else{
            Objects.requireNonNull(responseEntity.getBody()).setStatus("Fail");
            responseEntity.getBody().setMessage("There is an error with your purchase");
        }

        return responseEntity;
    }
}