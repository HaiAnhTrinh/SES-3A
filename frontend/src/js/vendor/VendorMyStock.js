import React, {useEffect, useState} from 'react';
import MaterialTable from 'material-table';
import Axios from "axios";
import * as firebase from "firebase";


export default function MaterialTableDemo(props) {
    const currentUser = firebase.auth().currentUser;
    const email = props.match.params.email;
    const [get, setGet] = React.useState([]);
    // const test = () =>setGet("Quan");
    // console.log("GetStart:", get);
    console.log("PRops: ", props);
    console.log("Email: ", email);

    return (
            <MaterialTable
                title="Current Stock"
                columns={
                    [
                        { title: 'Name', field: 'productName' },
                        { title: 'Description', field: 'description' },
                        { title: 'Quantity', field: 'productQuantity', type: 'numeric' },
                        { title: 'Category', field: 'productCategory'},
                        { title: 'Price', field: 'productPrice', initialEditValue: '$ '},
                        //{ title: 'Photo', field: 'photoUrl', render: rowData => <img src={rowData.photoURL} style={{width: 40, borderRadius: '50%'}}/> },
                    ]
                }
                data={() =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                            Axios.interceptors.request.use(request => {
                                console.log('Starting Request', request)
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
                                    resolve({
                                        data: result.data.products,
                                        page: 0,
                                        totalCount: 0,
                                    })
                                })
                                .catch((err) => {
                                        console.log("Error", err);
                                    }
                                )
                        },6000)

                    })
                }
                editable={{
                    onRowAdd: (newData) =>
                        new Promise((resolve) =>{
                            console.log(newData);
                            setTimeout(() => {
                                resolve();
                                console.log("QUAN");
                                console.log("EMAIL: ", email);
                                Axios.post("http://localhost:8080/AddProduct",
                                    {
                                        'email': email,
                                        'role': 'Supplier',
                                        'name': newData.productName,
                                        'price': newData.productPrice,
                                        'supplier': "",
                                        'quantity': newData.productQuantity,
                                        'category': newData.productCategory,
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

                            }, 6000)

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

                            }, 6000)

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
                                    .then(response => console.log("Delete Reponse", response))
                                    .catch((err) => {
                                            console.log("Error", err);
                                        }
                                    )

                            }, 6000)

                        }),
                }}
            />



    );
}