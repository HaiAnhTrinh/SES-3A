package com.ses3a.backend.entity.response;

import com.ses3a.backend.entity.object.UserInfo;

public class GetUserInfoResponse extends BaseResponse {

    private UserInfo userInfo;

    public GetUserInfoResponse() {
    }

    public UserInfo getUserInfo() {
        return userInfo;
    }

    public void setUserInfo(UserInfo userInfo) {
        this.userInfo = userInfo;
    }

}
