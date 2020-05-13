package com.ses3a.backend.entity.response;

public class GetUserInfoResponse extends BaseResponse {
    private String email;
    private String username;

    public GetUserInfoResponse(){

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
