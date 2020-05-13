import React from 'react';
import MaterialTable from 'material-table';
import Axios from "axios";


export default function MaterialTableDemo() {
    const [state, setState] = React.useState({
        columns: [
            { title: 'Name', field: 'name' },
            { title: 'Description', field: 'description' },
            { title: 'Quantity', field: 'quantity', type: 'numeric' },
            { title: 'Price', field: 'price'},
        ],
        data: [
            { name: 'Rice', description: 'Jasmine', quantity: 10, price: 63 },
            {
                name: 'Juice',
                description: 'Orange Juice',
                quantity: 217,
                price: 34,
            },
        ],
    });

    return (
        <MaterialTable
            title="Current Stock"
            columns={state.columns}
            data={state.data}
            editable={{
                onRowAdd: (newData) =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                            resolve();
                            setState((prevState) => {
                                const data = [...prevState.data];
                                data.push(newData);
                                return { ...prevState, data };
                            });
                        }, 600);
                    }),
                onRowUpdate: (newData, oldData) =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                            resolve();
                            if (oldData) {
                                setState((prevState) => {
                                    const data = [...prevState.data];
                                    data[data.indexOf(oldData)] = newData;
                                    return { ...prevState, data };
                                });
                            }
                        }, 600);
                    }),
                onRowDelete: (oldData) => {
                    Axios.interceptors.request.use(request => {
                        console.log('Starting Request', request)
                        return request
                    });
                    console.log("QUAN");
                    Axios.get("http://localhost:8080/GetUserInfo",
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'email': 'currentUser.email',
                                'role': 'Business owners'
                            }
                        })
                        .then(response => response.json())
                        // .then(result => {
                        //     resolve({
                        //         data: result.data,
                        //         page: result.page - 1,
                        //         totalCount: result.total,
                        //     })
                        // })
                        .catch((err) => {
                                console.log("Error", err);
                            }
                        )
                }


            }}
        />
    );
}