import React, { useState,useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import "../../css/VendorMyCartPage.css";
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

const months = [
    {value: 1,label: '01',},{value: 2,label: '02',},{value: 3,label: '03',},{value: 4,label: '04',},
    {value: 5,label: '05',},{value: 6,label: '06',},{value: 7,label: '07',},{value: 8,label: '08',},
    {value: 9,label: '09',},{value: 10,label: '10',},{value: 11,label: '11',},{value: 12,label: '12',}
];

const years = [
    {value: 2021,label: '2021',},{value: 2022,label: '2022',},{value: 2023,label: '2023',},{value: 2024,label: '2024',},
    {value: 2025,label: '2025',},{value: 2026,label: '2026',},{value: 2027,label: '2027',},{value: 2028,label: '2028',},
    {value: 2029,label: '2029',},{value: 2030,label: '2030',},{value: 2031,label: '2031',}
];

const countries = [
    {value: "Australia",label: 'Australia'}
];


export default function MyCart(props){
    const [email] = useState(props.match.params.email);
    const [cartItemsDetails,setCartItemDetails] = React.useState([]);
    const [total, setTotal] = useState();

    const [month, setMonth] = React.useState(null);
    const [year, setYear] = React.useState(null);
    const [country, setCountry] = React.useState(null);
    const [paymentCard,setPaymentCard] = React.useState(null);
    const [cardNumber,setCardNumber] = React.useState();
    const [cardName,setCardName] = React.useState("");
    const [address1,setAddress1] = React.useState("");
    const [address2,setAddress2] = React.useState("");
    const [city,setCity] = React.useState("");
    const [state,setState] = React.useState("");
    const [postalCode,setPostalCode] = React.useState("");
    const [phoneNumber,setPhoneNumber] = React.useState("");
    const [emailAddress,setEmailAddress] = React.useState("");
    const [cvv, setCvv] = React.useState();
    const [open, setOpen] = React.useState(false);
    const [proceedPayment,setProceedPayment] = React.useState(false);
    const [infoOnPaymentSubmission,setInfoOnPaymentSubmission] = React.useState(null);

    const useStyles = makeStyles( () => ({
        quantity: {
            width: 40,
        },
        cost: {
            width: 90,
        }
    }));
    const classes = useStyles();

    useEffect(() => {
        Axios.get("http://localhost:8080/GetCart",
            { headers: {'Content-Type': 'application/json', 'email': email}})
            .then((response) => {
                console.log(response)
                setCartItemDetails(response.data.cartProducts);
                var totalCost = 0;
                response.data.cartProducts.map((item) => totalCost += parseFloat(item.cost));
                setTotal(totalCost);
            })
            .catch((err) => console.log("Error: ", err));
    }, []);


    const handlePaymentSubmit = () => {
        console.log("cartItemsDetails", cartItemsDetails);
        const data = {
            "email": email,
            "cartProducts": cartItemsDetails
        }
        Axios.post("http://localhost:8080/Purchase", data,
            { headers: {'Content-Type': 'application/json'}} )
            .then((response) => console.log(response))
            .catch((error) => console.log(error));
        if(paymentCard === null || (cardNumber && cardNumber.length) !== 16 || month === null || year === null
            || country === null || (cvv && cvv.length) !== 3 || cardName.length === 0 || address1.length === 0
            || address2.length === 0 || city.length === 0 || state.length === 0
            || postalCode.length === 0 || phoneNumber.length === 0
            || emailAddress.length === 0 || !emailAddress.includes("@") || !emailAddress.includes(".")
            || (cardName && !(/\d/g.test(cardName))) === 0){
            setInfoOnPaymentSubmission("Some Information is Missing or Incorrect");
            setOpen(true);
        }
        else{
            setInfoOnPaymentSubmission("Payment Received. Thank You fvpor Payment");
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangeMonth = (event) => {
        setMonth(event.target.value);
    };
    const handleChangeYear = (event) => {
        setYear(event.target.value);
    };
    const handleChangeCountry = (event) => {
        setCountry(event.target.value);
    };
    const handleChangeCvv = (event) => {
        event.target.value = Math.max(0, parseInt(event.target.value) ).toString().slice(0,3);
        setCvv(event.target.value);
    };
    const handleCardNameChange = (event) => {
        setCardName(event.target.value);
    };

    const handleAddress1Change = (event) => {
        setAddress1(event.target.value);
    };
    const handleAddress2Change = (event) => {
        setAddress2(event.target.value);
    };
    const handleCityChange = (event) => {
        setCity(event.target.value);
    };
    const handleStateChange = (event) => {
        setState(event.target.value);
    };
    const handlePostalCodeChange = (event) => {
        setPostalCode(event.target.value);
    };
    const handlePhoneNumberChange = (event) => {
        setPhoneNumber(event.target.value);
    };
    const handleEmailAddressChange = (event) => {
        setEmailAddress(event.target.value);
    };


    const onItemQuantityChanged = (event, index, itemNew) => {
        var totalCost = 0;
        const data = {
            category: itemNew.category,
            cost: event.target.value * itemNew.price,
            description: itemNew.description,
            imageUrl: itemNew.imageUrl,
            name: itemNew.name,
            price: itemNew.price,
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
        list.map((item) => totalCost += parseFloat(item.cost));
        setTotal(totalCost);
    }

    const onProceedToPaymentButtonClick = (e) => {
        e.preventDefault();
        setProceedPayment(true);
    };

    // const onAddItemButtonClick = (e) => {
    //     props.history.push("/Vendor/" + email + "/Home");
    // };

    const onClickRemoveItem = (event, productName, supplierEmail) => {
        const data = {
            "email": email,
            "productName": productName,
            "supplierEmail": supplierEmail
        }
        console.log(data);
        Axios.post("http://localhost:8080/RemoveFromCart",
            data,
            { headers: {'Content-Type': 'application/json'}})
            .then((response) => {
                console.log(response);
                window.location.reload();
            })
            .catch((err) => {
                console.log("Error: ", err);
            });
    };

    const handlePaymentCardOption =  (e) => {

        if(e.target.value === "PayPal"){
            setPaymentCard("PayPal");
            window.open("https://www.paypal.com/au/signin");
        }
        else if(e.target.value === "Visa"){
            setPaymentCard("Visa");
        }
        else{
            setPaymentCard("MasterCard");
        }
    };

    const onCardDetailsInput = (e) => {
        e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,16);
        setCardNumber(e.target.value.toString());
    };

    const cartItems = cartItemsDetails.map((item, index) =>
        <TableRow key={index}>
            <TableCell>
                <button onClick={(event) => onClickRemoveItem(event, item.name, item.supplier)}>-</button>
            </TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.price}</TableCell>
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
        <div>

            <div class="my-cart-page-heading">
                <div class="my-cart-font"> Cart </div>
                <div class="my-cart-image"></div>
            </div>

            <div  class="my-cart-actions-holder-div">

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Remove</TableCell>
                                <TableCell>Item</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Supplier</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Cost</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cartItems}
                            <TableRow>
                                <TableCell align="right" colSpan={5}>Total</TableCell>
                                <TableCell align="left">{total}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                {/*<div class= "my-cart-additem-button-placement-div">*/}
                {/*    <Button type="submit" variant="contained"   color="primary" size="large" onClick={onAddItemButtonClick}>*/}
                {/*        Add item*/}
                {/*    </Button>*/}
                {/*</div>*/}

                <div className= {proceedPayment ? "hide-class-payment-button": "my-cart-proceed-payment-div"}>
                    <Button type="submit" variant="contained"   color="primary" size="large" onClick={onProceedToPaymentButtonClick}>
                        PROCEED TO PAYMENT
                    </Button>
                </div>

            </div>


            <div className= {proceedPayment ? "my-cart-payment-information-box": "my-cart-proceed-payment-div-hide"}>

                <div class="my-cart-heading-payment-info">
                    Payment Information
                </div>

                <div class="my-cart-sub-heading-payment">
                    Please enter you credit card information below and click Submit.
                </div>

                <div class="my-cart-payment-details-div-box">
                    <div class="my-cart-payment-info-details-box">
                        <div class="my-cart-payment-info-details-title">
                            Credit Cards Accepted
                        </div>
                        <div class="my-cart-payment-info-details-title">
                            Card Number
                        </div>
                        <div class="my-cart-payment-info-details-title">
                            Expiry Date (MM)
                        </div>
                        <div class="my-cart-payment-info-details-title">
                            CVV
                        </div>
                        <div class="my-cart-payment-info-details-title">
                            Name On Card
                        </div>
                        <div class="my-cart-payment-info-details-title">
                            Country
                        </div>
                        <div class="my-cart-payment-info-details-title">
                            Address 1
                        </div>
                        <div class="my-cart-payment-info-details-title">
                            Address 2
                        </div>
                        <div class="my-cart-payment-info-details-title">
                            City
                        </div>
                        <div class="my-cart-payment-info-details-title">
                            State
                        </div>
                        <div class="my-cart-payment-info-details-title">
                            Postal Code
                        </div>
                        <div class="my-cart-payment-info-details-title">
                            Contact Phone Number
                        </div>
                        <div class="my-cart-payment-info-details-title">
                            Email Address
                        </div>
                    </div>

                    <div class="my-cart-payment-info-filling-box">
                        <div class="my-cart-payment-info-filling-details-text">
                            <input type="radio" name="site_name"  checked={paymentCard === "Visa"} onClick={handlePaymentCardOption} value="Visa"/>
                            <span class="my-cart-radiobutton-text">Visa</span>

                            <input type="radio" name="site_name" checked={paymentCard === "MasterCard"}  onClick={handlePaymentCardOption} value="MasterCard"/>
                            <span class="my-cart-radiobutton-text">MasterCard</span>

                            <input type="radio" name="site_name"  checked={paymentCard === "PayPal"}  onClick={handlePaymentCardOption} value="PayPal"/>
                            <span class="my-cart-radiobutton-text">PayPal</span>

                        </div>
                        <div class="my-cart-payment-info-filling-details-text">
                            <TextField id="outlined-basic" type="number" variant="outlined" onInput = {onCardDetailsInput} />
                        </div>
                        <div class="my-cart-payment-info-filling-details-text" id="my-cart-month-select">
                            <TextField id="outlined-basic" select  value={month} onChange={handleChangeMonth}>
                                {months.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField id="outlined-basic" class="my-cart-year-select" select  value={year} onChange={handleChangeYear}>
                                {years.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                        <div class="my-cart-payment-info-filling-details-text my-cart-cvv-width-box">
                            <TextField id="outlined-basic" type="number"  variant="outlined" onInput = {handleChangeCvv} />
                        </div>
                        <div class="my-cart-payment-info-filling-details-text">
                            <TextField  variant="outlined" type="text" onChange={handleCardNameChange}/>
                        </div>
                        <div class="my-cart-payment-info-filling-details-text">
                            <TextField id="outlined-basic" select  value={country} onChange={handleChangeCountry}>
                                {countries.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                        <div class="my-cart-payment-info-filling-details-text">
                            <TextField  variant="outlined" onInput={handleAddress1Change} />
                        </div>
                        <div class="my-cart-payment-info-filling-details-text">
                            <TextField  variant="outlined" onInput={handleAddress2Change}  />
                        </div>
                        <div class="my-cart-payment-info-filling-details-text">
                            <TextField  variant="outlined" onInput={handleCityChange} />
                        </div>
                        <div class="my-cart-payment-info-filling-details-text">
                            <TextField  variant="outlined" onInput={handleStateChange} />
                        </div>
                        <div class="my-cart-payment-info-filling-details-text">
                            <TextField  variant="outlined" onInput={handlePostalCodeChange} type="number" />
                        </div>
                        <div class="my-cart-payment-info-filling-details-text">
                            <TextField  variant="outlined" onInput={handlePhoneNumberChange} type="number" />
                        </div>
                        <div class="my-cart-payment-info-filling-details-text">
                            <TextField  variant="outlined" onInput={handleEmailAddressChange} type="email" />
                        </div>

                        <div>
                            <Button variant="contained" color="primary" size="large" onClick={handlePaymentSubmit}>
                                Submit
                            </Button>
                            <Dialog
                                open={open}
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

                    </div>

                </div>

            </div>

        </div>

    );
}