package com.ses3a.backend.entity.request;

public class AddProductRequest extends BaseRequest{

    private String name;
    private String price;
    private String quantity;
    private String category;
    private String supplier;

    public AddProductRequest(String email,
                             String role,
                             String name,
                             String price,
                             String quantity,
                             String category,
                             String supplier) {
        this.setEmail(email);
        this.setRole(role);
        this.setName(name);
        this.setPrice(price);
        this.setQuantity(quantity);
        this.setCategory(category);
        this.setSupplier(supplier);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSupplier() {
        return supplier;
    }

    public void setSupplier(String supplier) {
        this.supplier = supplier;
    }
}
