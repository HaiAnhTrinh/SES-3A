package com.ses3a.backend.entity.object;

public class CartProduct {

    private String name;
    private String supplier;
    private String price;
    private String quantity;
    private String cost;
    private String category;

    public CartProduct(){
    }

    public CartProduct(String name,
                       String supplier,
                       String price,
                       String quantity,
                       String cost) {
        this.name = name;
        this.supplier = supplier;
        this.price = price;
        this.quantity = quantity;
        this.cost = cost;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSupplier() {
        return supplier;
    }

    public void setSupplier(String supplier) {
        this.supplier = supplier;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public String getCost() {
        return cost;
    }

    public void setCost(String cost) {
        this.cost = cost;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

}
