package com.ses3a.backend.entity;

public class CreateNewUserRequest {
    private String username;
    private String email;
    private String role;

    public CreateNewUserRequest(String username, String email, String role) {
        this.username = username;
        this.email = email;
        this.role = role;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
