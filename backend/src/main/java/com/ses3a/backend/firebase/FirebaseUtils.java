package com.ses3a.backend.firebase;

import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.ExecutionException;

public class FirebaseUtils {

    //convert roles on the app into dtb user type
    protected static String convertToUserType(String role) {
        return role.equals("Business owner") ? "vendors" : "suppliers";
    }

    //Generate current date in the format: "dd-MM-yyyy"
    protected static String getFormattedDate() {
        LocalDate currentDate = LocalDate.now();
        DateTimeFormatter formatObject = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        return currentDate.format(formatObject);
    }

    //Get the collection of a user: node 'users'
    protected static CollectionReference getUserCollection(Firestore firestore, String userType, String email) {
        return firestore.collection("users")
                .document(userType)
                .collection(email);
    }

    //Get the collection of a supplier product: node 'users'
    protected static CollectionReference getOneSupplierProduct(Firestore firestore, String email, String productName) {
        return getUserCollection(firestore, "suppliers", email)
                .document("products")
                .collection(productName);
    }

    //Get the collection of a vendor product: node 'users'
    //online products must have supplier field
    protected static CollectionReference getOneVendorProduct(Firestore firestore, String email,
                                                             String productName, String productSupplier) {
        if (productSupplier != null && productSupplier.length() > 0) {
            String productId = productSupplier.concat("-").concat(productName);
            return getUserCollection(firestore, "vendors", email)
                    .document("onlineProducts")
                    .collection(productId);
        }

        return getUserCollection(firestore, "vendors", email)
                .document("products")
                .collection(productName);
    }

    //Check if the supplier has an existing product: node 'users'
    //return 'true' if the product already exists
    protected static boolean supplierHasProduct(Firestore firestore,
                                                String email, String productName)
            throws ExecutionException, InterruptedException {

        return !getOneSupplierProduct(firestore, email, productName).get().get().isEmpty();
    }

    //Check if the vendor has an existing online product: node 'users'
    //return 'true' if the online product already exists
    protected static boolean vendorHasOnlineProduct(Firestore firestore, String email,
                                                    String productName, String productSupplier)
            throws ExecutionException, InterruptedException {

        if (productSupplier != null && productSupplier.length() > 0) {
            String productId = productSupplier.concat("-").concat(productName);
            CollectionReference userRef = getUserCollection(firestore, "vendors", email);
            return !userRef.document("onlineProducts").collection(productId).get().get().isEmpty();
        }

        return !getOneVendorProduct(firestore, email, productName, productSupplier).get().get().isEmpty();
    }

}
