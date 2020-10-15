import React, {useState, useEffect} from 'react';
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
import {handleAddWithPlaceHolderImage} from "../common/AxiosTasks";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

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

const handleEdit = (email, newData) => {
    axiosInterceptor("edit product")
    Axios.post("http://localhost:8080/EditProduct",
        {
            'email': email,
            'role': 'Business owner',
            'name': newData.productName,
            'price': newData.productPrice,
            'quantity': newData.productQuantity,
            'category': newData.productCategory,
            'description': newData.productDescription,
            'supplier': newData.supplierEmail ? newData.supplierEmail : "",
            "credit": ""
        },
        {
            headers: {'Content-Type': 'application/json'}
        })
        .then(response => console.log(response))
        .catch((err) => console.log("Error", err))
}

const handleDelete = (email, productName, supplierEmail) => {
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
    const [row, setRow] = useState(props.row);
    const email = props.email;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();

    const handleChange = (prop) => e => {
        setRow( {...row, [prop]: e.target.value} )
    }

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
                                    <IconButton aria-label="edit" onClick={() => handleEdit(email, row)}>
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                            <Table size="small" aria-label="purchases">
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>
                                            <OutlinedInput defaultValue={row.productQuantity}
                                                           onChange={handleChange("productQuantity")}/>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Price ($)</TableCell>
                                        <TableCell>
                                            <OutlinedInput defaultValue={row.productPrice}
                                                           onChange={handleChange("productPrice")}/>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Category</TableCell>
                                        <TableCell>
                                            <OutlinedInput defaultValue={row.productCategory}
                                                           onChange={handleChange("productCategory")}/>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Description</TableCell>
                                        <TableCell>
                                            <OutlinedInput defaultValue={row.productDescription}
                                                           onChange={handleChange("productDescription")}/>
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
    const [row1, setRow1] = useState(props.row1);
    const email = props.email;
    const [open1, setOpen1] = React.useState(false);
    const classes = useRowStyles();

    const handleChange = (prop) => e => {
        setRow1( {...row1, [prop]: e.target.value} )
    }

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
                                    <IconButton aria-label="edit" onClick={() => handleEdit(email, row1)}>
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                            <Table size="small" aria-label="purchases">
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>
                                            <OutlinedInput defaultValue={row1.productQuantity}
                                                           onChange={handleChange("productQuantity")}/>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Price ($)</TableCell>
                                        <TableCell>
                                            <OutlinedInput value={row1.productPrice} readOnly={true}/>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Category</TableCell>
                                        <TableCell>
                                            <OutlinedInput value={row1.productCategory} readOnly={true}/>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Description</TableCell>
                                        <TableCell>
                                            <OutlinedInput value={row1.productDescription} readOnly={true}/>
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

const AddDialog = (props) => {
    const [addDialogData, setAddDialogData] = useState({
        'productName': "",
        'productPrice': "",
        'productQuantity': "",
        'productCategory': "",
        'productDescription': "",
    });
    const onAddDialogChange = (prop) => e => {
        setAddDialogData( {...addDialogData, [prop]: e.target.value} )
    }

    return (
        <div>
            <Table>
                <TableRow>
                    <TableCell>
                        <Typography color="primary">Name</Typography>
                    </TableCell>
                    <TableCell>
                        <TextField onChange={onAddDialogChange('productName')}/>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>
                        <Typography color="primary">Price</Typography>
                    </TableCell>
                    <TableCell>
                        <TextField onChange={onAddDialogChange('productPrice')}/>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>
                        <Typography color="primary">Quantity</Typography>
                    </TableCell>
                    <TableCell>
                        <TextField onChange={onAddDialogChange('productQuantity')}/>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>
                        <Typography color="primary">Category</Typography>
                    </TableCell>
                    <TableCell>
                        <TextField onChange={onAddDialogChange('productCategory')}/>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>
                        <Typography color="primary">Description</Typography>
                    </TableCell>
                    <TableCell>
                        <TextField onChange={onAddDialogChange('productDescription')}/>
                    </TableCell>
                </TableRow>
            </Table>
            <Button onClick={()=> handleAddWithPlaceHolderImage(props.email, addDialogData, props.productPhotoRef, "Business owner")}>
                ADD
            </Button>
        </div>
    )
}


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
    const [openAddDialog, setOpenAddDialog] = useState(false);

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
                                    <IconButton aria-label="add" onClick={() => setOpenAddDialog(true)}>
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

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false)
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
            <img id="myImage" src={ProductPlaceHolder} width={0} height={0} alt="placeHolder"/>
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
                                    headerStyle: {textAlign:'left'}
                                },
                                {
                                    title: 'Price*', field: 'productPrice', type: 'currency',
                                    cellStyle: {textAlign: 'left'},
                                    headerStyle: {textAlign:'left'}
                                },
                                {
                                    title: 'Description', field: 'productDescription',
                                    cellStyle: {textAlign: 'left'},
                                    headerStyle: {textAlign:'left'}
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
                                        if( newData.productName && newData.productName.trim().length > 0 &&
                                            newData.productQuantity && newData.productQuantity.trim().length > 0 &&
                                            newData.productQuantity >0 &&
                                            newData.productCategory && newData.productCategory.trim().length > 0 &&
                                            newData.productPrice && newData.productPrice.trim().length > 0 &&
                                            newData.productPrice >0){
                                            setTimeout(() => {
                                                setNonMarketData([...nonMarketData, newData])
                                                handleAddWithPlaceHolderImage(email, newData, "defaultImageUrl", "Business owner")
                                                resolve()
                                            }, 1000)
                                        }
                                        else if(newData.productName && newData.productName.trim().length <= 0){
                                            resolve();
                                            alert("Name is required");
                                        }
                                        else if(newData.productQuantity && (newData.productQuantity.trim().length <= 0 ||
                                            newData.productQuantity < 0)){
                                            resolve();
                                            alert("Quantity is required and must be a positive value");
                                        }
                                        else if(newData.productCategory && newData.productCategory.trim().length <= 0){
                                            resolve();
                                            alert("Category is required");
                                        }
                                        else if(newData.productPrice && (newData.productPrice.trim().length <= 0 ||
                                            newData.productPrice < 0)) {
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
                                            handleEdit(email, newData)
                                            const dataUpdate = [...nonMarketData]
                                            dataUpdate[oldData.tableData.id] = newData
                                            setNonMarketData([...dataUpdate])
                                            resolve()
                                        }, 500)
                                    }),
                                onRowDelete: (oldData) =>
                                    new Promise((resolve) =>{
                                        setTimeout(() => {
                                            handleDelete(email, oldData.productName, null)
                                            const dataDelete = [...nonMarketData]
                                            dataDelete.splice(oldData.tableData.id, 1)
                                            setNonMarketData([...dataDelete])
                                            resolve()
                                        }, 500)
                                    })
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
                                            handleEdit(email, newData)
                                            const dataUpdate = [...marketData]
                                            dataUpdate[oldData.tableData.id] = newData
                                            setMarketData([...dataUpdate])
                                            resolve()
                                        }, 500)
                                    }),
                                onRowDelete: (oldData) =>
                                    new Promise((resolve) =>{
                                        setTimeout(() => {
                                            handleDelete(email, oldData.productName, oldData.supplierEmail)
                                            const dataDelete = [...marketData]
                                            dataDelete.splice(oldData.tableData.id, 1)
                                            setMarketData([...dataDelete])
                                            resolve()
                                        }, 500)
                                    }),
                            }}
                        />
                    </TabPanel>
                </SwipeableViews>
            </Hidden>

            <DropzoneDialog
                open={dropZoneOpen}
                onSave={handleDropZoneSave}
                acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                showPreviews={true}
                filesLimit={1}
                maxFileSize={5000000} //5MB
                onClose={handleDropZoneClose}
            />

            <Dialog onClose={handleClickCloseImageDialog} aria-labelledby="simple-dialog-title" open={openImageDialog}>
                <DialogTitle id="simple-dialog-title">Product Image</DialogTitle>
                <img src={imageUrl} alt="image"/>
            </Dialog>

            <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
                <AddDialog email={email} productPhotoRef={productPhotoRef}/>
            </Dialog>

        </div>
    );
}
