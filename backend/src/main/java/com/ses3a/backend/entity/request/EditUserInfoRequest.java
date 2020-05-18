package com.ses3a.backend.entity.request;

public class EditUserInfoRequest extends BaseRequest{
    private String username;
    private String address;
    private String phone;

    public EditUserInfoRequest(String email,
                               String role,
                               String username,
                               String address,
                               String phone){
        this.setEmail(email);
        this.setRole(role);
        this.setUsername(username);
        this.setAddress(address);
        this.setPhone(phone);
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
