import React, { useState,useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import "../../css/VendorMyCart.css";
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Axios from "axios";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core/styles";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]
const countries = ['Australia', 'America']


export default function MyCart(props){
    const [email] = useState(props.match.params.email);
    const [cartItemsDetails,setCartItemDetails] = React.useState([]);
    const [total, setTotal] = useState();
    const [credit, setCredit] = useState();

    const [values, setValues] = React.useState({
        cardAccept: '',
        cardNumber: 0,
        expiryMonth: '',
        expiryYear: '',
        cvv: 0,
        country: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        postalCode: '',
        contactPhoneNumber: '',
        emailAddress: ''
    })

    const [isShowPayment, setIsShowPayment] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [infoOnPaymentSubmission,setInfoOnPaymentSubmission] = useState(null);

    const useStyles = makeStyles( () => ({
        quantity: {
            width: 30,
        },
        cost: {
            width: 90,
        },
        listItemPrice: {
            textAlign: "center",
            paddingRight: "30px"
        }
    }));
    const classes = useStyles();

    useEffect(() => {
        Axios.get("http://localhost:8080/GetCart",
            { headers: {'Content-Type': 'application/json', 'email': email}})
            .then((response) => {
                setCartItemDetails(response.data.cartProducts);
                let totalCost = 0;
                let credit = 0;
                response.data.cartProducts.map((item) => {
                    totalCost += parseFloat(item.cost);
                    credit += parseFloat(item.credit);
                });
                setTotal(totalCost);
                setCredit(credit);
            })
            .catch((err) => console.log("Error: ", err));
    }, [email]);


    const handlePaymentSubmit = () => {
        const data = {
            "email": email,
            "cartProducts": cartItemsDetails
        }
        Axios.post("http://localhost:8080/Purchase", data,
            { headers: {'Content-Type': 'application/json'}} )
            .then((response) => console.log(response))
            .catch((error) => console.log(error));
        if(values.cardAccept === '' || values.cardNumber.length !== 16 || values.expiryMonth === '' || values.expiryYear === ''
            || values.country === '' || values.cvv.length !== 3 || values.address1.length === 0
            || values.address2.length === 0 || values.city.length === 0 || values.state.length === 0
            || values.postalCode.length === 0 || values.contactPhoneNumber.length === 0
            || values.emailAddress.length === 0){
            setInfoOnPaymentSubmission("Some Information is Missing or Incorrect");
            setOpenDialog(true);
        }
        else{
            setInfoOnPaymentSubmission("Payment Received. Thank You for Payment");
            setOpenDialog(true);
        }
    };

    const onPayWithCreditsButtonClick = () => {
        const data = {
            "email": email,
            "cartProducts": cartItemsDetails,
            "useCredit": true
        }

        if(props.credit > total){
            Axios.post("http://localhost:8080/Purchase", data,
                { headers: {'Content-Type': 'application/json'}} )
                .then((response) => {
                    window.alert(response.data.message);
                    window.location.reload();
                } )
                .catch((error) => console.log(error));
        }
        else {
            window.alert("INSUFFICIENT CREDIT");
        }
    }

    const handleClose = () => {
        setOpenDialog(false);
    };

    const onItemQuantityChanged = (event, index, itemNew) => {
        let totalCost = 0, credit = 0;
        const data = {
            category: itemNew.category,
            cost: event.target.value * itemNew.price,
            description: itemNew.description,
            imageUrl: itemNew.imageUrl,
            name: itemNew.name,
            price: itemNew.price,
            credit: itemNew.credit,
            quantity: event.target.value,
            supplier: itemNew.supplier,
        }

        const list = cartItemsDetails.map((item, tempIndex) => {
            if(index === tempIndex){
                return data;
            }
            else{
                return item;
            }
        });

        setCartItemDetails(list);
        list.map((item) => {
            totalCost += parseFloat(item.cost);
            credit += parseFloat(item.credit) * item.quantity;
        });
        setTotal(totalCost);
        setCredit(credit);
    }

    const onClickRemoveItem = (event, productName, supplierEmail) => {
        const data = {
            "email": email,
            "productName": productName,
            "supplierEmail": supplierEmail
        }
        Axios.post("http://localhost:8080/RemoveFromCart",
            data,
            { headers: {'Content-Type': 'application/json'}})
            .then((response) => {
                console.log("onClickRemoveItem");
                window.location.reload();
            })
            .catch((err) => {
                console.log("Error: ", err);
            });
    };

    const handleChange = prop => e => {
        const { value } = e.target
        setValues({ ...values, [prop]: value })
    }

    const cartItemsList = cartItemsDetails.map((item, index) =>
        <div>
            <ListItem key={index}>
                <ListItemText
                    primary={item.name + " - $" + item.price }
                    secondary={
                        <React.Fragment>
                            <Typography variant="body2">{"Credit: $" + item.credit}</Typography>
                            {item.supplier}
                        </React.Fragment>
                    }
                />
                <TextField
                    className={classes.quantity}
                    onChange={(event) => onItemQuantityChanged(event, index, item)}
                    defaultValue={item.quantity}
                    inputProps={{
                        min: 1
                    }}
                    type="number"
                />
                <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={(event) => onClickRemoveItem(event, item.name, item.supplier)}>
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
            <Divider variant="fullwidth" component="li" />
        </div>

    );

    const cartItemsTable = cartItemsDetails.map((item, index) =>
        <TableRow key={index}>
            <TableCell>
                <button onClick={(event) => onClickRemoveItem(event, item.name, item.supplier)}>-</button>
            </TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.price}</TableCell>
            <TableCell>{item.credit}</TableCell>
            <TableCell>{item.supplier}</TableCell>
            <TableCell>
                <TextField
                    className={classes.quantity}
                    onChange={(event) => onItemQuantityChanged(event, index, item)}
                    defaultValue={item.quantity}
                    inputProps={{
                        min: 1
                    }}
                    type="number"
                />
            </TableCell>
            <TableCell>
                <TextField
                    className={classes.cost}
                    InputProps={{
                        readOnly: true,
                    }}
                    value={item.cost}
                    type="number"
                />
            </TableCell>
        </TableRow>
    );


    return(
        <div className='my-cart-container'>

            <div className='page-title'>Cart</div>

            <div className='table-container'>
                <Hidden smUp implementation="css">
                    <List>
                        {cartItemsList}
                    </List>
                    <Typography variant="h6">
                        {"Total cost: " + total}
                    </Typography>
                    <Typography variant="h6">
                        {"Credit: " + credit}
                    </Typography>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Remove</TableCell>
                                    <TableCell>Item</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Credit</TableCell>
                                    <TableCell>Supplier</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Cost</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cartItemsTable}
                                <TableRow>
                                    <TableCell align="right" colSpan={5}>Total</TableCell>
                                    <TableCell  align="left">{"$" + total}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right" colSpan={5}>Credit</TableCell>
                                    <TableCell  align="left">{"$" + credit}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Hidden>
                <br/>
                <div className='record-to-payment'>
                    {!isShowPayment ? (
                        <Button onClick={() => setIsShowPayment(true)} variant='contained' color='primary'>
                            PROCEED TO PAYMENT
                        </Button>
                    ) : null}
                </div>
                <div className='pay-with-credit'>
                    <Button type="submit" variant="contained" color="primary" onClick={onPayWithCreditsButtonClick}>
                        PAY WITH CREDITS
                    </Button>
                </div>

            </div>

            {isShowPayment ? (
                <div className='form-wrapper'>
                    <div className='payment-information'>Payment Information</div>
                    <div className='title-tip'>
                        Please enter your credit card information below
                    </div>
                    <div className='form-item'>
                        <div className='credit-label'>Credit Cards Accepted</div>
                        <RadioGroup row onChange={handleChange('cardAccept')}>
                            <FormControlLabel value='visa' control={<Radio color='primary' />} label='Visa' />
                            <FormControlLabel
                                value='masterCard'
                                control={<Radio color='primary' />}
                                label='MasterCard'
                            />
                            <FormControlLabel value='payPal' control={<Radio color='primary' />} label='PayPal' />
                        </RadioGroup>
                    </div>
                    <div className='form-item'>
                        <div className='label'>Card Number</div>
                        <TextField
                            onChange={handleChange('cardNumber')}
                            size='small'
                            type='number'
                            variant='outlined'
                            className='input-full'
                        />
                    </div>
                    <div className='form-item'>
                        <div className='label'>Expiry Date(MM)</div>
                        <TextField
                            select
                            size='small'
                            variant='outlined'
                            value={values.expiryMonth}
                            onChange={handleChange('expiryMonth')}
                        >
                            {months.map(month => (
                                <MenuItem key={month} value={month}>
                                    {month}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            size='small'
                            variant='outlined'
                            className='input-item'
                            value={values.expiryYear}
                            onChange={handleChange('expiryYear')}
                        >
                            {years.map(year => (
                                <MenuItem key={year} value={year}>
                                    {year}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                    <div className='form-item'>
                        <div className='label'>CVV</div>
                        <TextField
                            onChange={handleChange('cvv')}
                            size='small'
                            type='number'
                            variant='outlined'
                            className='input-full'
                        />
                    </div>
                    <div className='form-item'>
                        <div className='label'>Name On Cart</div>
                        <TextField
                            onChange={handleChange('name')}
                            size='small'
                            variant='outlined'
                            className='input-full'
                        />
                    </div>
                    <div className='form-item'>
                        <div className='label'>Country</div>
                        <TextField
                            onChange={handleChange('country')}
                            select
                            size='small'
                            variant='outlined'
                            value={values.country}
                            className='input-full'
                        >
                            {countries.map(country => (
                                <MenuItem key={country} value={country}>
                                    {country}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>

                    <div className='form-item'>
                        <div className='label'>Address1</div>
                        <TextField
                            onChange={handleChange('address1')}
                            size='small'
                            variant='outlined'
                            className='input-full'
                        />
                    </div>
                    <div className='form-item'>
                        <div className='label'>Address2</div>
                        <TextField
                            onChange={handleChange('address2')}
                            size='small'
                            variant='outlined'
                            className='input-full'
                        />
                    </div>

                    <div className='form-item'>
                        <div className='label'>City</div>
                        <TextField
                            onChange={handleChange('city')}
                            size='small'
                            variant='outlined'
                            className='input-full'
                        />
                    </div>

                    <div className='form-item'>
                        <div className='label'>State</div>
                        <TextField
                            onChange={handleChange('state')}
                            size='small'
                            variant='outlined'
                            className='input-full'
                        />
                    </div>

                    <div className='form-item'>
                        <div className='label'>Postal Code</div>
                        <TextField
                            onChange={handleChange('postalCode')}
                            size='small'
                            variant='outlined'
                            type='number'
                            className='input-full'
                        />
                    </div>

                    <div className='form-item'>
                        <div className='label'>Contact Phone Number</div>
                        <TextField
                            onChange={handleChange('contactPhoneNumber')}
                            size='small'
                            variant='outlined'
                            type='number'
                            className='input-full'
                        />
                    </div>

                    <div className='form-item'>
                        <div className='label'>Email Address</div>
                        <TextField
                            onChange={handleChange('emailAddress')}
                            size='small'
                            variant='outlined'
                            className='input-full'
                        />
                    </div>

                    <div className='form-item submit'>
                        <Button onClick={handlePaymentSubmit} variant='contained' color='primary' >
                            SUBMIT
                        </Button>
                    </div>
                </div>
            ) : null}

            <Dialog
                open={openDialog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"Alert"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {infoOnPaymentSubmission}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" size="large"  onClick={handleClose} color="primary" autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>

    );
}
