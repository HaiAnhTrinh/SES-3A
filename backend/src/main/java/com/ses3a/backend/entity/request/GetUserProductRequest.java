package com.ses3a.backend.entity.request;

public class GetUserProductRequest extends BaseRequest{

    public GetUserProductRequest(String email, String role){
        this.setEmail(email);
        this.setRole(role);
    }
}
