import React, {useEffect, useState, useRef, useLayoutEffect} from 'react';
import MaterialTable from 'material-table';
import Axios from "axios";
import * as firebase from "firebase";
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: "100%",
    },
}));

export default function MaterialTableDemo(props) {
    const currentUser = firebase.auth().currentUser;
    const email = props.match.params.email;
    const [get, setGet] = React.useState([]);

    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const targetRef = useRef();
    const [dimensions, setDimensions] = useState({ width:0, height: 0 });

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

    return (

        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    <Tab label="Un-Market Stock" {...a11yProps(0)} />
                    <Tab label="Market Stock" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <MaterialTable
                        tableLayout = 'auto'
                        title="Current Stock"
                        columns={
                            [
                                { title: 'Name', field: 'productName',
                                    cellStyle: {
                                        width: 20,
                                        maxWidth: 20
                                    },
                                    headerStyle: {
                                        width:20,
                                        maxWidth: 20
                                    }},
                                { title: 'Quantity', field: 'productQuantity', type: 'numeric',
                                    cellStyle: {
                                        width: 20,
                                        maxWidth: 20
                                    },
                                    headerStyle: {
                                        width:20,
                                        maxWidth: 20
                                    }},
                                { title: 'Category', field: 'productCategory',
                                    cellStyle: {
                                        width: 20,
                                        maxWidth: 20
                                    },
                                    headerStyle: {
                                        width:20,
                                        maxWidth: 20
                                    }},
                                { title: 'Price', field: 'productPrice', initialEditValue: '$ ',
                                    cellStyle: {
                                        width: 20,
                                        maxWidth: 20
                                    },
                                    headerStyle: {
                                        width:20,
                                        maxWidth: 20
                                    }},
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
                                },600)

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

                                    }, 600)

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
                                            .then(response => console.log("Delete Reponse", response))
                                            .catch((err) => {
                                                    console.log("Error", err);
                                                }
                                            )

                                    }, 600)

                                }),
                        }}
                    />
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <MaterialTable
                        title="Current Stock"
                        columns={
                            [
                                { title: 'Name', field: 'productName' },
                                { title: 'Quantity', field: 'productQuantity', type: 'numeric' },
                                { title: 'Unit', field: 'unit'},
                                { title: 'Category', field: 'productCategory'},
                                { title: 'Price', field: 'productPrice', initialEditValue: '$ '},
                                { title: 'Supplier', field: 'supplier'},
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
                                },600)

                            })
                        }
                        editable={{
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
                                            .then(response => console.log("Delete Reponse", response))
                                            .catch((err) => {
                                                    console.log("Error", err);
                                                }
                                            )

                                    }, 600)

                                }),
                        }}
                    />
                </TabPanel>

            </SwipeableViews>
        </div>
    );
}