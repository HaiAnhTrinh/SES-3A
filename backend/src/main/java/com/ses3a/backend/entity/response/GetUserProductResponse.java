package com.ses3a.backend.entity.response;

import java.util.List;

public class GetUserProductResponse extends BaseResponse{

    List<Object> products;
    List<Object> onlineProducts;

    public GetUserProductResponse(){
    }

    public List<Object> getProducts() {
        return products;
    }

    public void setProducts(List<Object> products) {
        this.products = products;
    }

    public List<Object> getOnlineProducts() {
        return onlineProducts;
    }

    public void setOnlineProducts(List<Object> onlineProducts) {
        this.onlineProducts = onlineProducts;
    }
}
