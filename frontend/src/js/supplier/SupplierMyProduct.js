import React, {useState, useEffect} from 'react';
import MaterialTable from 'material-table';
import Axios from "axios";
import * as firebase from "firebase";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import {DropzoneDialog} from "material-ui-dropzone";
import ProductPlaceHolder from "../../image/Image-Coming-Soon-Placeholder.jpg";
import Hidden from "@material-ui/core/Hidden";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import AddBoxIcon from "@material-ui/icons/AddBox";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import PropTypes from "prop-types";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import DeleteIcon from "@material-ui/icons/Delete";
import Collapse from "@material-ui/core/Collapse";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/Edit";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {handleAddWithPlaceHolderImage} from "../common/AxiosTasks";

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

const Row = (props) => {
    const [row, setRow] = useState(props.row);
    const email = props.email;
    const [open, setOpen] = useState(false);
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
                <TableCell component="th" scope="row" onClick={() => setOpen(!open)}>
                    <Box fontWeight="fontWeightBold" m={1} fontSize={16}>
                        {row.productName}
                    </Box>
                </TableCell>
                <TableCell>
                    <Tooltip title="Delete Product">
                        <IconButton aria-label="delete" onClick={() => handleDelete(email, row.productName, row.productCategory)}>
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
                            <Table size="small">
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>
                                            <OutlinedInput defaultValue={row.productQuantity}
                                                           onChange={handleChange('productQuantity')}/>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Price ($)</TableCell>
                                        <TableCell>
                                            <OutlinedInput defaultValue={row.productPrice}
                                                           onChange={handleChange('productPrice')}/>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Category</TableCell>
                                        <TableCell>
                                            <OutlinedInput value={row.productCategory} readOnly={true}/>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Description</TableCell>
                                        <TableCell>
                                            <OutlinedInput defaultValue={row.productDescription}
                                                           onChange={handleChange('productDescription')}/>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Credit</TableCell>
                                        <TableCell>
                                            <OutlinedInput value={row.productCredit}
                                                           onChange={handleChange('productCredit')}/>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={2}>
                                            <img alt="product" src={row.productImageUrl} width={250} height={250}/>
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
        productCredit: PropTypes.number.isRequired,
        productImageUrl: PropTypes.string.isRequired
    }).isRequired,
    email: PropTypes.string.isRequired
};

const handleDelete = (email, productName, productCategory) => {
    Axios.post("http://localhost:8080/DeleteProduct",
        {
            'email': email,
            'role': 'Supplier',
            'name': productName,
            'category': productCategory
        },
        {
            headers: {'Content-Type': 'application/json'}
        })
        .then(response => console.log("Delete Response", response))
        .catch((err) => console.log("Error", err))
}

const handleEdit = (email, newData) => {
    Axios.post("http://localhost:8080/EditProduct",
        {
            'email': email,
            'role': 'Supplier',
            'name': newData.productName,
            'price': newData.productPrice,
            'quantity': newData.productQuantity,
            'category': newData.productCategory,
            'description': newData.productDescription,
            'credit': newData.productCredit,
            'supplier':""
        },
        {
            headers: {'Content-Type': 'application/json'}
        })
        .then(response => console.log(response))
        .catch((err) => console.log("Error", err))
}

const AddDialog = (props) => {
    const [addDialogData, setAddDialogData] = useState({
        'productName': "",
        'productPrice': "",
        'productQuantity': "",
        'productCategory': "",
        'productDescription': "",
        'productCredit': "",
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
                        <Typography color="primary">Credit</Typography>
                    </TableCell>
                    <TableCell>
                        <TextField onChange={onAddDialogChange('productCredit')}/>
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
            <Button onClick={()=> handleAddWithPlaceHolderImage(props.email, addDialogData, props.productPhotoRef, "Supplier")}>
                ADD
            </Button>
        </div>
    )
}

export default function MyProduct(props){
    console.log("SUPPLIER MY PRODUCT");

    const email = props.match.params.email;
    const [productData, setProductData] = useState([]);
    const [chosen, setChosen] = useState("");
    const [dropZoneOpen, setDropZoneOpen] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openImageDialog, setOpenImageDialog] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const productPhotoRef = firebase.storage().ref().child("product photos");
    const firestoreRef = firebase.firestore();

    useEffect( () => {
        Axios.get("http://localhost:8080/GetUserProduct", {
                headers: {
                    'Content-Type': 'application/json',
                    'email': email,
                    'role': 'Supplier'
                }
            }
        )
            .then( result => setProductData(result.data.products))
            .catch( error => console.log(error))
    }, [])

    const handleDropZoneOpen = () => {
        setDropZoneOpen(true);
    }

    const handleDropZoneClose = () => {
        setDropZoneOpen(false);
    }

    const handleDropZoneSave = (file) => {
        const photoRef = productPhotoRef.child(email.concat("-").concat(chosen));
        const productRef = firestoreRef.collection("users")
            .doc("suppliers")
            .collection(email)
            .doc("products")
            .collection(chosen)
            .doc("info");

        photoRef.put(file[0]).on('state_changed',
            (snapshot) =>
            {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done')
            }, (error) => {
                console.log(error)
            },  () => {
                photoRef.getDownloadURL().then( (url) => {
                    productRef.update({
                        "imageUrl": url,
                    })
                        .then(()=> window.location.reload())
                        .catch((error)=> console.log(error))
                })
            }
        )
        handleDropZoneClose();
    }

    const handleCloseImageDialog = () => {
        setOpenImageDialog(false)
    }

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false)
    }

    return(
        <div>
            <img id="myImage" src={ProductPlaceHolder} width={0} height={0} alt="placeHolder"/>
            <Hidden smUp implementation="css">
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>
                                    <Box fontWeight="fontWeightBold" m={1} fontSize="h6.fontSize">
                                        CURRENT STOCK
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
                            {productData.map((row) => (
                                <Row key={row.productName} row={row} email={email}/>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Hidden>
            <Hidden xsDown implementation="css">
                <MaterialTable
                    title="Current Stock"
                    columns={[
                        { title: 'Name*', field: 'productName', editable: 'onAdd'},
                        { title: 'Quantity*', field: 'productQuantity', type:'numeric'},
                        { title: 'Category*', field: 'productCategory', editable: 'onAdd'},
                        { title: 'Price*', field: 'productPrice', type: 'currency'},
                        { title: 'Credit', field: 'productCredit', type: 'numeric'},
                        { title: 'Description', field: 'productDescription'},
                    ]}

                    data={productData}

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
                            }
                        },
                    ]}

                    options={{
                        actionsColumnIndex: -1,
                        search: false,
                    }}

                    editable={{
                        onRowAdd: (newData) =>
                            new Promise((resolve) => {

                                if( newData.productName && newData.productName.trim().length > 0 &&
                                    newData.productQuantity && newData.productQuantity.trim().length > 0 &&
                                    newData.productQuantity >0 &&
                                    newData.productCredit && newData.productCredit.trim().length >= 0 &&
                                    newData.productCategory && newData.productCategory.trim().length > 0 &&
                                    newData.productPrice && newData.productPrice.trim().length > 0 &&
                                    newData.productPrice >0){
                                    setTimeout(() => {
                                        setProductData([...productData, newData])
                                        handleAddWithPlaceHolderImage(email, newData, productPhotoRef, "Supplier")
                                        resolve();
                                    }, 1000)
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
                                setTimeout(() => {
                                    handleEdit(email, newData)
                                    const dataUpdate = [...productData]
                                    dataUpdate[oldData.tableData.id] = newData
                                    setProductData([...dataUpdate])
                                    resolve()
                                }, 500)
                            }),
                        onRowDelete: (oldData) =>
                            new Promise((resolve) =>{
                                setTimeout(() => {
                                    handleDelete(email, oldData.productName, oldData.productCategory)
                                    const dataDelete = [...productData]
                                    dataDelete.splice(oldData.tableData.id, 1)
                                    setProductData([...dataDelete])
                                    resolve()
                                }, 500)
                            })
                    }}
                />
            </Hidden>

            <DropzoneDialog
                open={dropZoneOpen}
                onSave={handleDropZoneSave}
                acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                showPreviews={true}
                filesLimit={1}
                maxFileSize={5000000}
                onClose={handleDropZoneClose}
            />

            <Dialog onClose={handleCloseImageDialog} open={openImageDialog}>
                <DialogTitle id="simple-dialog-title">Product Image</DialogTitle>
                <img src={imageUrl} alt="product"/>
            </Dialog>

            <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
                <AddDialog email={email} productPhotoRef={productPhotoRef}/>
            </Dialog>

        </div>
    );
}