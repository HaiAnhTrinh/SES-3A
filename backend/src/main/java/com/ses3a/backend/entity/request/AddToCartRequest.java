package com.ses3a.backend.entity.request;

import com.ses3a.backend.entity.object.SupplierProduct;

public class AddToCartRequest extends BaseRequest{

    private SupplierProduct product;
    private String quantity;

    public AddToCartRequest(String supplierEmail,
                            String productName,
                            String productPrice,
                            String productCategory,
                            String quantity,
                            String email){
        this.product = new SupplierProduct(supplierEmail, productName, productPrice, null, productCategory);
        this.setQuantity(quantity);
        this.setEmail(email);
    }

    public SupplierProduct getProduct() {
        return product;
    }

    public void setProduct(SupplierProduct product) {
        this.product = product;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

}
