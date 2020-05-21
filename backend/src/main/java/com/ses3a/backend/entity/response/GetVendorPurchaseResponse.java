package com.ses3a.backend.entity.response;

import java.util.List;

public class GetVendorPurchaseResponse extends BaseResponse {

    List<Object> purchaseHistory;

    public GetVendorPurchaseResponse(){
    }

    public List<Object> getPurchaseHistory() {
        return purchaseHistory;
    }

    public void setPurchaseHistory(List<Object> purchaseHistory) {
        this.purchaseHistory = purchaseHistory;
    }
}
