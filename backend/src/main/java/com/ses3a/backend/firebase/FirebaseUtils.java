package com.ses3a.backend.firebase;

public class FirebaseUtils {

    //convert roles on the app into dtb user type
    protected static String convertToUserType(String role){
        if(role.equals("Business owner")){
            return "vendors";
        }
        return "suppliers";
    }

}
