package com.ses3a.backend.entity.request;

import com.ses3a.backend.entity.object.CartProduct;

import java.util.List;

public class PurchaseRequest extends BaseRequest {

    private List<CartProduct> cartProducts;
    private boolean useCredit;

    public PurchaseRequest() {
    }

    public PurchaseRequest(List<CartProduct> cartProducts) {
        this.cartProducts = cartProducts;
    }

    public List<CartProduct> getCartProducts() {
        return cartProducts;
    }

    public void setCartProducts(List<CartProduct> cartProducts) {
        this.cartProducts = cartProducts;
    }

    public boolean isUseCredit() {
        return useCredit;
    }

    public void setUseCredit(boolean useCredit) {
        this.useCredit = useCredit;
    }
}
