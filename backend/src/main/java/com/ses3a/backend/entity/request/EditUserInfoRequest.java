package com.ses3a.backend.entity.request;

public class EditUserInfoRequest extends BaseRequest{
    private String username;

    public EditUserInfoRequest(String email, String role, String username){
        this.setEmail(email);
        this.setRole(role);
        this.setUsername(username);
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
