package com.ses3a.backend.entity.request;

public class AddDeliveredPurchaseRequest extends BaseRequest{

    private String id;

    public AddDeliveredPurchaseRequest(String email, String id){
        this.setEmail(email);
        this.setId(id);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

}
