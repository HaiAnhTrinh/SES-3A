package com.ses3a.backend.entity.response;

import com.ses3a.backend.entity.object.CartProduct;

import java.util.List;

public class GetCartResponse extends BaseResponse{

    List<CartProduct> cartProducts;

    public GetCartResponse(){
    }

    public List<CartProduct> getCartProducts() {
        return cartProducts;
    }

    public void setCartProducts(List<CartProduct> cartProducts) {
        this.cartProducts = cartProducts;
    }
}
