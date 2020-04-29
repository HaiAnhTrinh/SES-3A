package com.ses3a.backend.entity.request;

public class CreateNewUserRequest extends BaseRequest {
    private String username;

    public CreateNewUserRequest(String username, String email, String role) {
        this.setUsername(username);
        this.setEmail(email);
        this.setRole(role);
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
