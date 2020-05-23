package com.ses3a.backend.entity.request;

public class DeleteProductRequest extends BaseRequest{

    private String name;
    private String category;
    private String supplier;

    public DeleteProductRequest(String email, String role, String name, String category, String supplier){
        this.setEmail(email);
        this.setRole(role);
        this.setName(name);
        this.setCategory(category);
        this.setSupplier(supplier);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
