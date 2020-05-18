package com.ses3a.backend.entity.object;

public class UserInfo {

    private String email;
    private String username;
    private String address;
    private String phone;

    public UserInfo(String email, String username, String address, String phone){
        this.email = email;
        this.username = username;
        this.address = address;
        this.phone = phone;
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

}
