package com.ses3a.backend.entity.request;

public class GetSupplierPendingPurchaseRequest extends BaseRequest {

    public GetSupplierPendingPurchaseRequest(String email) {
        this.setEmail(email);
    }

}
