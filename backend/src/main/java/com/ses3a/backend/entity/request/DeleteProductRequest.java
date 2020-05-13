package com.ses3a.backend.entity.request;

public class DeleteProductRequest extends BaseRequest{

    private String name;
    private String category;

    public DeleteProductRequest(String email, String role, String name, String category){
        this.setEmail(email);
        this.setRole(role);
        this.setName(name);
        this.setCategory(category);
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
}
