import React, {useState, useRef, useLayoutEffect} from 'react';
import MaterialTable from 'material-table';
import Axios from "axios";
import * as firebase from "firebase";
import PropTypes from 'prop-types';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import {DropzoneDialog} from "material-ui-dropzone";
import ProductPlaceHolder from "../../image/Image-Coming-Soon-Placeholder.jpg";

export default function MyProduct(props){
    const email = props.match.params.email;

    const [chosen, setChosen] = useState("");
    const [dropZoneOpen, setDropZoneOpen] = useState(false);

    const handleDropZoneOpen = () => {
        setDropZoneOpen(true);
    }

    const handleDropZoneClose = () => {
        setDropZoneOpen(false);
    }

    const handleDropZoneSave = (file) => {
        console.log("image file: ", file);
        const photoRef = productPhotoRef.child(email.concat("-").concat(chosen));
        const productRef = firestoreRef.collection("users")
            .doc("vendors")
            .collection(email)
            .doc("products")
            .collection(chosen)
            .doc("info");

        console.log("before put");
        photoRef.put(file[0]).on('state_changed',
            (snapshot) =>
            {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            }, (error) => {
                console.log(error);
            },  () => {
                photoRef.getDownloadURL().then( (url) => {
                    productRef.update({
                        "imageUrl": url,
                    })
                        .then(()=> window.location.reload())
                        .catch((error)=> console.log(error));
                });
            }
        )
        handleDropZoneClose();
    }


    const targetRef = useRef();
    const [dimensions, setDimensions] = useState({ width:0, height: 0 });
    const [openImageDialog, setOpenImageDialog] = React.useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const productPhotoRef = firebase.storage().ref().child("product photos");
    const firestoreRef = firebase.firestore();

    const handleClickCloseImageDialog = () => {
        setOpenImageDialog(false);
    }

    useLayoutEffect(() => {
        if (targetRef.current) {
            setDimensions({
                width: targetRef.current.offsetWidth,
                height: targetRef.current.offsetHeight
            });
        }
    }, []);


    function isPhone() {
        if(dimensions.width < 541){
            return true;
        }else {
            return false;
        }
    }
    console.log("SUPPLIER MY PRODUCT");
    return(

        <div>
            <div ref={targetRef}>

                <p hidden={true}> {dimensions.width}</p>
                <p hidden={true}>{dimensions.height}</p>

            </div>
            <Dialog onClose={handleClickCloseImageDialog} aria-labelledby="simple-dialog-title" open={openImageDialog}>
                <DialogTitle id="simple-dialog-title">Product Image</DialogTitle>
                <img src={imageUrl}/>
            </Dialog>
            <MaterialTable
                title="Current Stock"
                columns={
                    [
                        { title: 'Name*', field: 'productName', editable: 'onAdd',},

                        { title: 'Quantity*', field: 'productQuantity', type:'numeric',

                        },
                        // { title: 'Unit', field: 'productUnit',hidden: isPhone(),},
                        { title: 'Category*', field: 'productCategory', editable: 'onAdd'},
                        { title: 'Price*', field: 'productPrice', type: 'currency',hidden: isPhone(),},
                        { title: 'Description', field: 'productDescription',hidden: isPhone()},
                    ]
                }
                data={
                    (query) =>
                        new Promise((resolve) => {
                            setTimeout(() => {
                                Axios.interceptors.request.use(request => {
                                    console.log('Data Receive Request', request)
                                    return request
                                });

                                Axios.get("http://localhost:8080/GetUserProduct", {
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'email': email,
                                            'role': 'Supplier'
                                        }
                                    }
                                )
                                    .then(result => {
                                        console.log("Result: ", result)
                                        console.log("Result data", result.data.products)
                                        var data = [];
                                        for (var i = query.pageSize * (query.page+1) - query.pageSize;
                                             i <= query.pageSize * (query.page+1) - 1; i++)
                                        {
                                            if(i +1 > result.data.products.length){
                                                break;}
                                            else{
                                                data.push(result.data.products[i]);
                                            }
                                        }
                                        resolve({
                                            data: data,
                                            page: query.page,
                                            totalCount: result.data.products.length,
                                        })
                                    })
                                    .catch((err) => {
                                            console.log("Error", err);
                                        }
                                    )
                            },3000)
                        })
                }

                detailPanel={[
                    {
                        tooltip: 'Show Details',
                        disabled: !isPhone(),
                        render: rowData => {
                            return (
                                <div
                                    style={{
                                        textAlign: 'center'
                                    }}
                                >
                                    <p>Description: {rowData.productDescription}</p>
                                    <p>Total cost: {rowData.productPrice}</p>
                                </div>
                            )
                        }
                    }

                ]}

                actions={[
                    {
                        icon: 'addImageIcon',
                        tooltip: 'Add Image',
                        onClick: (event, rowData) => {
                            setChosen(rowData.productName);
                            handleDropZoneOpen();
                        }
                    },
                    {
                        icon: 'image',
                        tooltip: 'Show Image',
                        onClick:
                            (event, rowData) => {
                                console.log("ImageRowData", rowData)

                                setOpenImageDialog(true);
                                setImageUrl(rowData.productImageUrl);
                            },
                    },
                ]}

                options={{
                    actionsColumnIndex: -1,
                    search: false,
                }}

                editable={{
                    onRowAdd: (newData) =>
                        new Promise((resolve) =>{
                            /**********************************************************************************/
                            const photoRef = productPhotoRef.child(email.concat("-").concat(newData.productName));
                            if( newData.productName && newData.productName.trim().length > 0 &&
                                newData.productQuantity && newData.productQuantity.trim().length > 0 &&
                                newData.productQuantity >0 &&
                                newData.productCategory && newData.productCategory.trim().length > 0 &&
                                newData.productPrice && newData.productPrice.trim().length > 0 &&
                                newData.productPrice >0){
                                setTimeout(() => {
                                    resolve();
                                    let canvas = document.createElement('canvas');
                                    let context = canvas.getContext('2d');
                                    const img = new Image();
                                    img.src = ProductPlaceHolder;
                                    canvas.width = 600;
                                    canvas.height = 600;
                                    context.drawImage(img, 0, 0);

                                    canvas.toBlob( (blob) => {
                                        console.log("inside toBlob");
                                        console.log("blob", blob);
                                        photoRef.put(blob).on('state_changed',
                                            (snapshot) =>
                                            {
                                                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                                console.log('Upload is ' + progress + '% done');
                                            }, (error) => {
                                                console.log(error);
                                            },  () => {
                                                photoRef.getDownloadURL().then( (url) => {
                                                    console.log("url: ", url);
                                                    Axios.interceptors.request.use(request => {
                                                        console.log('Add Request', request)
                                                        return request
                                                    });
                                                    Axios.post("http://localhost:8080/AddProduct",
                                                        {
                                                            'email': email,
                                                            'name': newData.productName,
                                                            'price': newData.productPrice,
                                                            'supplier': "",
                                                            'quantity': newData.productQuantity,
                                                            'category': newData.productCategory,
                                                            'description':
                                                                newData.productDescription &&
                                                                newData.productDescription.trim().length > 0
                                                                    ? newData.productDescription
                                                                    : "",
                                                            'imageUrl': url,
                                                            'role': 'Supplier',
                                                        },
                                                        {
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                            }
                                                        })
                                                        .then(response => console.log(response))
                                                        .catch((err) => {
                                                                console.log("Error", err);
                                                            }
                                                        )
                                                });
                                            }
                                        )
                                    }, 'image/jpg');
                                    /******************************************************************************/
                                }, 600)
                            }
                            else if(newData.productName && newData.productName.trim().length <= 0){
                                resolve();
                                alert("Name is required");
                            }
                            else if(newData.productQuantity && newData.productQuantity.trim().length <= 0 &&
                                newData.productQuantity >0){
                                resolve();
                                alert("Quantity is required and must be a positive value");
                            }
                            else if(newData.productCategory && newData.productCategory.trim().length <= 0){
                                resolve();
                                alert("Category is required");
                            }
                            else if(newData.productPrice && newData.productPrice.trim().length <= 0 &&
                                newData.productPrice > 0) {
                                resolve();
                                alert("Price is required and must be a positive value");
                            }
                            else{
                                resolve();
                                alert("Name, Quantity, Category and Price are required")
                            }

                        }),
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve) =>{
                            console.log(newData);
                            setTimeout(() => {
                                resolve();
                                console.log("QUAN");
                                console.log("EMAIL: ", email);
                                Axios.interceptors.request.use(request => {
                                    console.log('Edit Request', request)
                                    return request
                                });
                                Axios.post("http://localhost:8080/EditProduct",
                                    {
                                        'email': email,
                                        'role': 'Supplier',
                                        'name': newData.productName,
                                        'price': newData.productPrice,
                                        'quantity': newData.productQuantity,
                                        'category': newData.productCategory,
                                        'description': newData.productDescription,
                                        'supplier':""

                                    },
                                    {
                                        headers: {
                                            'Content-Type': 'application/json',
                                        }
                                    })
                                    .then(response => console.log(response))
                                    .catch((err) => {
                                            console.log("Error", err);
                                        }
                                    )

                            }, 600)

                        }),
                    onRowDelete: (oldData) =>
                        new Promise((resolve) =>{
                            setTimeout(() => {
                                resolve();
                                Axios.interceptors.request.use(request => {
                                    console.log('Delete Request', request)
                                    return request
                                });
                                Axios.post("http://localhost:8080/DeleteProduct",
                                    {
                                        'email': email,
                                        'role': 'Supplier',
                                        'name': oldData.productName,
                                        'category': oldData.productCategory,

                                    },
                                    {
                                        headers: {
                                            'Content-Type': 'application/json',
                                        }
                                    })
                                    .then(response => console.log("Delete Response", response))
                                    .catch((err) => {
                                            console.log("Error", err);
                                        }
                                    )

                            }, 600)

                        }),
                }}

            />

            <DropzoneDialog
                open={dropZoneOpen}
                onSave={handleDropZoneSave}
                acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                showPreviews={true}
                filesLimit={1}
                maxFileSize={5000000}
                // initialFiles={image}
                onClose={handleDropZoneClose}
            />

        </div>


    );
}
