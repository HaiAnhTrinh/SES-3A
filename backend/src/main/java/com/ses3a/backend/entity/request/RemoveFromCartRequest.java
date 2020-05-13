package com.ses3a.backend.entity.request;

public class RemoveFromCartRequest extends BaseRequest{

    private String productName;
    private String supplierEmail;

    public RemoveFromCartRequest(String email, String productName, String supplierEmail){
        this.setEmail(email);
        this.setProductName(productName);
        this.setSupplierEmail(supplierEmail);
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getSupplierEmail() {
        return supplierEmail;
    }

    public void setSupplierEmail(String supplierEmail) {
        this.supplierEmail = supplierEmail;
    }

}
