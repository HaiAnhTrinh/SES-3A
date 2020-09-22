import React, {useState, useRef, useLayoutEffect, useEffect} from 'react';
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
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import {DropzoneDialog} from "material-ui-dropzone";
import ProductPlaceHolder from "../../image/Image-Coming-Soon-Placeholder.jpg";
import Hidden from "@material-ui/core/Hidden";
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import DeleteIcon from '@material-ui/icons/Delete';
import AddBoxIcon from '@material-ui/icons/AddBox';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from "@material-ui/core/Tooltip";
import OutlinedInput from "@material-ui/core/OutlinedInput";


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

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

const axiosInterceptor = (type) => {
    Axios.interceptors.request.use(request => {
        console.log(type, request)
        return request
    });
}

const handleGet = (query, email) => {
    new Promise((resolve) => {
        setTimeout(() => {
            axiosInterceptor("get request")
            Axios.get("http://localhost:8080/GetUserProduct",
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'email': email,
                        'role': 'Business owner'
                    }
                }
            )
                .then(result => {
                    var data = [];
                    for (var i = query.pageSize * (query.page+1) - query.pageSize;
                         i <= query.pageSize * (query.page+1) - 1; i++)
                    {
                        if(i +1 > result.data.onlineProducts.length){
                            break;}
                        else{
                            data.push(result.data.onlineProducts[i]);
                        }
                    }
                    resolve({
                        data: data,
                        page: query.page,
                        totalCount: result.data.onlineProducts.length,
                    })
                })
                .catch((err) => console.log("Error", err))
        },600)
    })
}

const handleEdit = (email, productName, productPrice, productQuantity,
                    productCategory, productDescription, productImageUrl, supplierEmail) => {
    axiosInterceptor("edit request")
    Axios.post("http://localhost:8080/EditProduct",
        {
            'email': email,
            'role': 'Business owner',
            'name': productName,
            'price': productPrice,
            'quantity': productQuantity,
            'category': productCategory,
            'description': productDescription,
            'imageUrl': productImageUrl,
            'supplier': supplierEmail,
        },
        {
            headers: {'Content-Type': 'application/json'}
        })
        .then(response => console.log(response))
        .catch((err) => console.log("Error", err))
}

const handleDelete = (email, productName, supplierEmail) => {
    axiosInterceptor("delete request")
    Axios.post("http://localhost:8080/DeleteProduct",
        {
            'email': email,
            'role': 'Business owner',
            'name': productName,
            'supplier': supplierEmail
        },
        {
            headers: {'Content-Type': 'application/json'}
        })
        .then(response => console.log("Delete Response", response))
        .catch((err) => console.log("Error", err))
}

const Row = (props) => {
    const row = props.row;
    const email = props.email;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    <Box fontWeight="fontWeightBold" m={1} fontSize={16}>
                        {row.productName}
                    </Box>
                </TableCell>
                <TableCell>
                    <Tooltip title="Delete Product">
                        <IconButton aria-label="delete" onClick={() => handleDelete(email, row.productName, null)}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <TableCell>
                                <Typography variant="h6" gutterBottom component="div">
                                    Product Detail
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Tooltip title="Edit Product Detail">
                                    <IconButton aria-label="edit">
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                            <Table size="small" aria-label="purchases">
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>
                                            <OutlinedInput value={row.productQuantity}/>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Price ($)</TableCell>
                                        <TableCell>
                                            <OutlinedInput value={row.productPrice}/>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Category</TableCell>
                                        <TableCell>
                                            <OutlinedInput value={row.productCategory}/>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Description</TableCell>
                                        <TableCell>
                                            <OutlinedInput value={row.productDescription}/>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>

        </React.Fragment>
    );
}

const Row1 = (props) => {
    const row1 = props.row1;
    const email = props.email;
    const [open1, setOpen1] = React.useState(false);
    const classes = useRowStyles();
    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen1(!open1)}>
                        {open1 ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    <div>
                        <Box fontWeight="fontWeightBold" m={1} fontSize={16}>
                            {row1.productName}
                        </Box>
                    </div>
                    <div>
                        <Box fontStyle="italic" m={1}>
                            SUPPLIER:
                        </Box>
                        <Box fontWeight="fontWeightRegular" m={1}>
                            {row1.supplierEmail}
                        </Box>
                    </div>
                </TableCell>
                <TableCell>
                    <Tooltip title="Delete Product">
                        <IconButton aria-label="delete" onClick={() => handleDelete(email, row1.productName, row1.supplierEmail)}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open1} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <TableCell>
                                <Typography variant="h6" gutterBottom component="div">
                                    Product Detail
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Tooltip title="Edit Product Detail">
                                    <IconButton aria-label="edit">
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                            <Table size="small" aria-label="purchases">
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>
                                            <OutlinedInput value={row1.productQuantity}/>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Price ($)</TableCell>
                                        <TableCell>
                                            <OutlinedInput value={row1.productPrice}/>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Category</TableCell>
                                        <TableCell>
                                            <OutlinedInput value={row1.productCategory}/>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Description</TableCell>
                                        <TableCell>
                                            <OutlinedInput value={row1.productDescription}/>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>

        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        productName: PropTypes.string.isRequired,
        productQuantity: PropTypes.number.isRequired,
        productCategory: PropTypes.string.isRequired,
        productDescription: PropTypes.string.isRequired,
        productPrice: PropTypes.number.isRequired,
    }).isRequired,
    email: PropTypes.string.isRequired
};

Row1.propTypes = {
    row1: PropTypes.shape({
        productName: PropTypes.string.isRequired,
        supplierEmail: PropTypes.string.isRequired,
        productQuantity: PropTypes.number.isRequired,
        productCategory: PropTypes.string.isRequired,
        productDescription: PropTypes.string.isRequired,
        productPrice: PropTypes.number.isRequired,
    }).isRequired,
    email: PropTypes.string.isRequired
};


export default function MaterialTableDemo(props) {

    const email = props.match.params.email;
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const [chosen, setChosen] = useState("");
    const [dropZoneOpen, setDropZoneOpen] = useState(false);
    const [nonMarketData, setNonMarketData] = useState([]);
    const [marketData, setMarketData] = useState([]);
    const [rows, setRows] = useState([]);
    const [rows1, setRows1] = useState([]);
    const [openImageDialog, setOpenImageDialog] = React.useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const productPhotoRef = firebase.storage().ref().child("product photos");
    const firestoreRef = firebase.firestore();

    const nonMarketTable = (rows) => {
        return (
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>
                                <Box fontWeight="fontWeightBold" m={1} fontSize="h6.fontSize">
                                    MY STOCK
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Tooltip title="Add New Product">
                                    <IconButton aria-label="add">
                                        <AddBoxIcon />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <Row key={row.productName} row={row} email={email}/>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    const marketTable = (rows1) => {
        return (
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>
                                <Box fontWeight="fontWeightBold" fontSize="h6.fontSize" m={1}>
                                    MY STOCK
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Tooltip title="Add New Product">
                                    <IconButton aria-label="add">
                                        <AddBoxIcon />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows1.map((row1) => (
                            <Row1 key={row1.productName} row1={row1} email={email}/>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    useEffect(() => {
        Axios.get("http://localhost:8080/GetUserProduct", {
                headers: {
                    'Content-Type': 'application/json',
                    'email': email,
                    'role': 'Business owner'
                }
            }
        )
            .then(result => {
                setRows(result.data.products)
                setNonMarketData(result.data.products)
                setRows1(result.data.onlineProducts)
                setMarketData(result.data.onlineProducts)
            })
            .catch((err) => {
                    console.log("Error", err);
                }
            )
    },[])

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

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const handleClickCloseImageDialog = () => {
        setOpenImageDialog(false);
    }

    const appBar = () => {
        return (
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    <Tab label="Non-Market Stock" {...a11yProps(0)} />
                    <Tab label="Market Stock" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
        )
    }


    return(
        <div className={classes.root}>
            <Hidden smUp implementation="css">
                {appBar()}
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={value}
                    onChangeIndex={handleChangeIndex}
                >
                    <TabPanel value={value} index={0} dir={theme.direction}>
                        {nonMarketTable(rows)}
                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                        {marketTable(rows1)}
                    </TabPanel>
                </SwipeableViews>
            </Hidden>

            <Hidden xsDown implementation="css">
                <Dialog onClose={handleClickCloseImageDialog} aria-labelledby="simple-dialog-title" open={openImageDialog}>
                    <DialogTitle id="simple-dialog-title">Product Image</DialogTitle>
                    <img src={imageUrl} alt="image"/>
                </Dialog>
                {appBar()}
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={value}
                    onChangeIndex={handleChangeIndex}
                >
                    <TabPanel value={value} index={0} dir={theme.direction}>
                        <MaterialTable
                            title="Current Stock"
                            columns={[
                                {
                                    title: 'Name*', field: 'productName', editable: 'onAdd',
                                    cellStyle: {textAlign: 'left'}
                                },
                                {
                                    title: 'Quantity*', field: 'productQuantity', type:'numeric',
                                    cellStyle: {textAlign: 'left'},
                                    headerStyle:{textAlign:'left'}
                                },
                                {
                                    title: 'Category*', field: 'productCategory',
                                    cellStyle: {textAlign: 'left'},
                                    headerStyle:{textAlign:'left'}
                                },
                                {
                                    title: 'Price*', field: 'productPrice', type: 'currency',
                                    cellStyle: {textAlign: 'left'},
                                    headerStyle:{textAlign:'left'}
                                },
                                {
                                    title: 'Description', field: 'productDescription',
                                    cellStyle: {textAlign: 'left'},
                                    headerStyle:{textAlign:'left'}
                                },
                            ]}

                            data={nonMarketData}

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
                                    onClick: (event, rowData) => {
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
                                                    photoRef.put(blob).on('state_changed',
                                                        (snapshot) =>
                                                        {
                                                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                                            console.log('Upload is ' + progress + '% done');
                                                        }, (error) => {
                                                            console.log(error);
                                                        },  () => {
                                                            photoRef.getDownloadURL().then( (url) => {
                                                                axiosInterceptor('Add product request');
                                                                Axios.post("http://localhost:8080/AddProduct",
                                                                    {
                                                                        'email': email,
                                                                        'name': newData.productName,
                                                                        'price': newData.productPrice,
                                                                        'supplier': "",
                                                                        'quantity': newData.productQuantity,
                                                                        'category': newData.productCategory,
                                                                        'credit': "",
                                                                        'description':
                                                                            newData.productDescription &&
                                                                            newData.productDescription.trim().length > 0
                                                                                ? newData.productDescription
                                                                                : "",
                                                                        'imageUrl': url,
                                                                        'role': 'Business owner',
                                                                    },
                                                                    {
                                                                        headers: {'Content-Type': 'application/json'}
                                                                    })
                                                                    .then(response => console.log(response))
                                                                    .catch((err) => console.log("Error", err))
                                                            });
                                                        }
                                                    )
                                                }, 'image/jpg');

                                            }, 600)
                                        }
                                        else if(newData.productName && newData.productName.trim().length <= 0){
                                            resolve();
                                            alert("Name is required");
                                        }
                                        else if(newData.productQuantity && newData.productQuantity.trim().length <= 0 ||
                                            newData.productQuantity >0){
                                            resolve();
                                            alert("Quantity is required and must be a positive value");
                                        }
                                        else if(newData.productCategory && newData.productCategory.trim().length <= 0){
                                            resolve();
                                            alert("Category is required");
                                        }
                                        else if(newData.productPrice && newData.productPrice.trim().length <= 0 ||
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
                                        setTimeout(() => {
                                            handleEdit(email, newData.productName,
                                                newData.productPrice, newData.productQuantity,
                                                newData.productCategory, newData.productDescription,
                                                null, null)
                                            const dataUpdate = [...nonMarketData]
                                            dataUpdate[oldData.tableData.id] = newData
                                            setNonMarketData([...dataUpdate])
                                            resolve()
                                        }, 1000)
                                    }),
                                onRowDelete: (oldData) =>
                                    new Promise((resolve) =>{
                                        setTimeout(() => {
                                            handleDelete(email, oldData.productName, null)
                                            const dataDelete = [...nonMarketData]
                                            dataDelete.splice(oldData.tableData.id, 1)
                                            setNonMarketData([...dataDelete])
                                            resolve()
                                        }, 1000)
                                    }),
                            }}
                        />
                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                        <MaterialTable
                            title="Current Stock"
                            columns={[
                                { title: 'Name', field: 'productName', editable: 'never',},
                                { title: 'Quantity', field: 'productQuantity', type: 'numeric', },
                                { title: 'Category', field: 'productCategory', editable: 'never'},
                                { title: 'Price', field: 'productPrice', initialEditValue: '$', editable: 'never'},
                                { title: 'Supplier', field: 'supplierEmail', editable: 'never'},
                                { title: 'Description', field: 'productDescription', editable: 'never'}
                            ]}
                            data={marketData}

                            options={{
                                actionsColumnIndex: -1,
                                search: false,
                            }}

                            editable={{
                                onRowUpdate: (newData, oldData) =>
                                    new Promise((resolve) =>{
                                        setTimeout(() => {
                                            handleEdit(email, newData.productName,
                                                newData.productPrice, newData.productQuantity,
                                                newData.productCategory, newData.productDescription,
                                                newData.productImageUrl, newData.supplierEmail)
                                            const dataUpdate = [...marketData]
                                            dataUpdate[oldData.tableData.id] = newData
                                            setMarketData([...dataUpdate])
                                            resolve()
                                        }, 1000)
                                    }),
                                onRowDelete: (oldData) =>
                                    new Promise((resolve) =>{
                                        setTimeout(() => {
                                            handleDelete(email, oldData.productName, oldData.supplierEmail)
                                            const dataDelete = [...marketData]
                                            dataDelete.splice(oldData.tableData.id, 1)
                                            setMarketData([...dataDelete])
                                            resolve()
                                        }, 1000)
                                    }),
                            }}
                        />
                    </TabPanel>
                </SwipeableViews>
                <DropzoneDialog
                    open={dropZoneOpen}
                    onSave={handleDropZoneSave}
                    acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                    showPreviews={true}
                    filesLimit={1}
                    maxFileSize={5000000} //5MB
                    onClose={handleDropZoneClose}
                />
            </Hidden>

        </div>
    );
}