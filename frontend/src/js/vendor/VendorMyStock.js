import React, {useEffect, useState} from 'react';
import MaterialTable from 'material-table';
import Axios from "axios";
import * as firebase from "firebase";


export default function MaterialTableDemo() {
    const currentUser = firebase.auth().currentUser;

    const [get, setGet] = React.useState([]);
    const test = () =>setGet("Quan");
    console.log("GetStart:", get);

    return (
        <div>
            <button onClick={test}>
                Test
            </button>
            <MaterialTable
                title="Current Stock"
                columns={
                    [
                        { title: 'Name', field: 'productName' },
                        { title: 'Description', field: 'description' },
                        { title: 'Quantity', field: 'productQuantity', type: 'numeric' },
                        { title: 'Category', field: 'productCategory'},
                        { title: 'Price (AUD)', field: 'productPrice', initialEditValue: '$ '},
                        //{ title: 'Photo', field: 'photoUrl', render: rowData => <img src={rowData.photoURL} style={{width: 40, borderRadius: '50%'}}/> },
                    ]
                }
                data={() =>
                    new Promise((resolve) => {
                        firebase.auth().onAuthStateChanged( (currentUser) =>{
                            Axios.get("http://localhost:8080/GetUserProduct",{
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'email': currentUser.email,
                                        'role' : 'Supplier'
                                    }
                                }
                            )
                                .then(result =>{
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
                        })
                    })
                }
                editable={{
                    onRowAdd: (newData) =>
                        new Promise((resolve) =>{
                            console.log(newData);
                            setTimeout(() => {
                                resolve();
                                console.log("QUAN");
                                Axios.interceptors.request.use(request => {
                                    console.log('Add Request', request)
                                    return request
                                });
                                Axios.post("http://localhost:8080/AddProduct",
                                    {
                                        'email': currentUser.email,
                                        'role': 'Supplier',
                                        'name': newData.productName,
                                        'price': newData.productPrice,
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

                            }, 600)

                        }),
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve) => {
                            setTimeout(() => {
                                resolve();
                                // if (oldData) {
                                //     setState((prevState) => {
                                //         const data = [...prevState.data];
                                //         data[data.indexOf(oldData)] = newData;
                                //         return { ...prevState, data };
                                //     });
                                // }
                            }, 600);
                        }),
                    onRowDelete: (oldData) =>
                        new Promise((resolve) =>{
                            setTimeout(() => {
                                resolve();
                                console.log("QUAN");
                                Axios.interceptors.request.use(request => {
                                    console.log('Delete Request', request)
                                    return request
                                });
                                console.log("oldData: ",oldData)
                                Axios.post("http://localhost:8080/DeleteProduct",
                                    {
                                        'email': currentUser.email,
                                        'role': 'Supplier',
                                        'name': oldData.productName,
                                        'category': oldData.productCategory,
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
                }}
            />
        </div>



    );
}