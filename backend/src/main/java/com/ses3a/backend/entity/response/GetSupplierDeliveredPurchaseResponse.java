package com.ses3a.backend.entity.response;

import java.util.List;

public class GetSupplierDeliveredPurchaseResponse extends BaseResponse{

    List<Object> deliveredPurchases;

    public GetSupplierDeliveredPurchaseResponse(){
    }

    public List<Object> getDeliveredPurchases() {
        return deliveredPurchases;
    }

    public void setDeliveredPurchases(List<Object> deliveredPurchases) {
        this.deliveredPurchases = deliveredPurchases;
    }

}
