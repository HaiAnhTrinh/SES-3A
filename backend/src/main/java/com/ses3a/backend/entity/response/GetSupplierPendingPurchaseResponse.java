package com.ses3a.backend.entity.response;

import java.util.List;

public class GetSupplierPendingPurchaseResponse extends BaseResponse {

    List<Object> pendingPurchases;

    public GetSupplierPendingPurchaseResponse() {
    }

    public List<Object> getPendingPurchases() {
        return pendingPurchases;
    }

    public void setPendingPurchases(List<Object> pendingPurchases) {
        this.pendingPurchases = pendingPurchases;
    }

}
