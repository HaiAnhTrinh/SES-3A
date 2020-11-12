package com.ses3a.backend.entity.request;

public class GetProductByCategoryRequest extends BaseRequest {

    private String category;

    public GetProductByCategoryRequest(String email, String category) {
        this.setEmail(email);
        this.setCategory(category);
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
