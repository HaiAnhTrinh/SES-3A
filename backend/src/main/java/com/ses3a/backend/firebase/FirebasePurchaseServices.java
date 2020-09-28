package com.ses3a.backend.firebase;

import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.firebase.cloud.FirestoreClient;
import com.ses3a.backend.Configs;
import com.ses3a.backend.entity.object.CartProduct;
import com.ses3a.backend.entity.request.AddDeliveredPurchaseRequest;
import com.ses3a.backend.entity.request.GetSupplierDeliveredPurchaseRequest;
import com.ses3a.backend.entity.request.GetSupplierPendingPurchaseRequest;
import com.ses3a.backend.entity.request.GetVendorPurchaseRequest;
import org.springframework.stereotype.Service;

import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FirebasePurchaseServices {

    //add purchase to the record
    public void addConfirmedPurchase(CollectionReference purchaseRef, CartProduct cartProduct) {
        String formattedDate = FirebaseUtils.getFormattedDate();

        Map<String, Object> data = new HashMap<>();
        data.put("name", cartProduct.getName());
        data.put("supplier", cartProduct.getSupplier());
        data.put("quantity", cartProduct.getQuantity());
        data.put("cost", cartProduct.getCost());
        data.put("category", cartProduct.getCategory());
        data.put("date", formattedDate);

        purchaseRef.add(data);
    }

    public List<Object> getVendorPurchase(@NotNull GetVendorPurchaseRequest request) {
        Firestore firestore = FirestoreClient.getFirestore();
        List<Object> purchases = new ArrayList<>();

        try {
            List<QueryDocumentSnapshot> purchasesDocuments =
                    firestore.collection(Configs.VENDOR_PURCHASES_COLLECTION)
                            .document(request.getEmail())
                            .collection("purchaseHistory")
                            .get()
                            .get()
                            .getDocuments();
            for (QueryDocumentSnapshot purchase : purchasesDocuments) {
                purchases.add(purchase.getData());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return purchases;
    }

    public List<Object> getSupplierPendingPurchase(GetSupplierPendingPurchaseRequest request) {
        Firestore firestore = FirestoreClient.getFirestore();
        List<Object> purchases = new ArrayList<>();

        try {
            List<QueryDocumentSnapshot> purchasesDocuments =
                    firestore.collection(Configs.SUPPLIER_PURCHASES_COLLECTION)
                            .document(request.getEmail())
                            .collection("pendingPurchases")
                            .get()
                            .get()
                            .getDocuments();
            for (QueryDocumentSnapshot purchase : purchasesDocuments) {
                Map<String, Object> data = new HashMap<>();
                data.put("id", purchase.getReference().getId());
                data.putAll(purchase.getData());
                purchases.add(data);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return purchases;
    }

    public List<Object> getSupplierDeliveredPurchase(GetSupplierDeliveredPurchaseRequest request) {
        Firestore firestore = FirestoreClient.getFirestore();
        List<Object> purchases = new ArrayList<>();

        try {
            List<QueryDocumentSnapshot> purchasesDocuments =
                    firestore.collection(Configs.SUPPLIER_PURCHASES_COLLECTION)
                            .document(request.getEmail())
                            .collection("deliveredPurchases")
                            .get()
                            .get()
                            .getDocuments();
            for (QueryDocumentSnapshot purchase : purchasesDocuments) {
                purchases.add(purchase.getData());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return purchases;
    }

    //move a purchase from 'pending' to 'delivered'
    public void pendingToDelivered(@NotNull AddDeliveredPurchaseRequest request) {
        Firestore firestore = FirestoreClient.getFirestore();
        try {
            DocumentReference purchaseRef = firestore.collection(Configs.SUPPLIER_PURCHASES_COLLECTION)
                    .document(request.getEmail())
                    .collection("pendingPurchases")
                    .document(request.getId());

            //add to delivered purchases
            firestore.collection(Configs.SUPPLIER_PURCHASES_COLLECTION)
                    .document(request.getEmail())
                    .collection("deliveredPurchases")
                    .document(request.getId())
                    .create(purchaseRef.get().get().getData());

            //delete from the pending purchases
            purchaseRef.delete();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
