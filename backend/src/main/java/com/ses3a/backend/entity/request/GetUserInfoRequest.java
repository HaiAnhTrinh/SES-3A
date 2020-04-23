package com.ses3a.backend.entity.request;

public class GetUserInfoRequest extends BaseRequest{

    public GetUserInfoRequest(String email, String role){
        this.setEmail(email);
        this.setRole(role);
    }

}