import React from "react";
import Axios from "axios";

const handleAdd = (email, newData, url, role) => {
    Axios.post("http://localhost:8080/AddProduct",
        {
            'email': email,
            'name': newData.productName,
            'price': newData.productPrice,
            'supplier': "",
            'quantity': newData.productQuantity,
            'category': newData.productCategory,
            'description':
                (newData.productDescription && newData.productDescription.trim().length > 0)
                    ? newData.productDescription : "",
            'credit': role === "Supplier" ? newData.productCredit : "",
            'imageUrl': url,
            'role': role
        },
        {
            headers: {'Content-Type': 'application/json'}
        })
        .then(response => console.log(response))
        .catch((err) => console.log("Error", err))
}

export const handleAddWithPlaceHolderImage = (email, newData, productPhotoRef, role) => {
    const photoRef = productPhotoRef.child(email.concat("-").concat(newData.productName));
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    const img = document.getElementById("myImage");
    canvas.width = 600;
    canvas.height = 600;
    context.drawImage(img, 0, 0);

    canvas.toBlob( (blob) => {
        photoRef.put(blob).on('state_changed',
            (snapshot) =>
            {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            }, (error) => {
                console.log(error);
            },  () => {
                photoRef.getDownloadURL().then( (url) => {
                    handleAdd(email, newData, url, role)
                });
            }
        )
    }, 'image/jpg');
}