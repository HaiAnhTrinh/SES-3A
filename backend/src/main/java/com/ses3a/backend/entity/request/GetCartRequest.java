package com.ses3a.backend.entity.request;

public class GetCartRequest extends BaseRequest{

    public GetCartRequest(String email){
        this.setEmail(email);
    }

}
