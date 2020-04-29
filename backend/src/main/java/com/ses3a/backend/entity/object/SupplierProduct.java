package com.ses3a.backend.entity.object;

public class SupplierProduct {
    private String supplierEmail;
    private String productName;
    private String productPrice;
    private String productQuantity;

    public SupplierProduct(){
    }

    public SupplierProduct(String supplierEmail,
                           String productName,
                           String productPrice,
                           String productQuantity) {
        this.supplierEmail = supplierEmail;
        this.productName = productName;
        this.productPrice = productPrice;
        this.productQuantity = productQuantity;
    }

    public String getSupplierEmail() {
        return supplierEmail;
    }

    public void setSupplierEmail(String supplierEmail) {
        this.supplierEmail = supplierEmail;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(String productPrice) {
        this.productPrice = productPrice;
    }

    public String getProductQuantity() {
        return productQuantity;
    }

    public void setProductQuantity(String productQuantity) {
        this.productQuantity = productQuantity;
    }
}
