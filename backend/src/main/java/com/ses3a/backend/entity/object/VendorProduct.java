package com.ses3a.backend.entity.object;

public class VendorProduct {
    private String productName;
    private String productQuantity;

    public VendorProduct(){
    }

    public VendorProduct(String productName,
                         String productQuantity) {
        this.productName = productName;
        this.productQuantity = productQuantity;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductQuantity() {
        return productQuantity;
    }

    public void setProductQuantity(String productQuantity) {
        this.productQuantity = productQuantity;
    }
}
