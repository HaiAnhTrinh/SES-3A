package com.ses3a.backend.entity.response;

import com.ses3a.backend.entity.object.SupplierProduct;

import java.util.List;

public class GetProductByCategoryResponse extends BaseResponse{
    List<SupplierProduct> products;

    public GetProductByCategoryResponse(){
    }

    public List<SupplierProduct> getProducts() {
        return products;
    }

    public void setProducts(List<SupplierProduct> products) {
        this.products = products;
    }
}
