import React, { useState, useEffect } from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import '../../css/LoginPage.css';
import VendorLoginPage from "../vendor/VendorLoginPage";
import SupplierLoginPage from "../supplier/SupplierLoginPage";
import SupplierLayout from "../supplier/SupplierLayout";
import VendorLayout from "../vendor/VendorLayout";
import CreateNewUser from "./CreateNewUser";
import VendorMyCartPage from "../vendor/VendorMyCart";
import VendorMyStockPage from "../vendor/VendorMyStock";
import * as firebase from "firebase/app";

export default function AppRouter() {

    const firebaseConfig = {
        apiKey: "AIzaSyDecNHLnCMMSlD-XlJ9HKCH474AMdv9CLs",
        authDomain: "ses3a-be963.firebaseapp.com",
        databaseURL: "https://ses3a-be963.firebaseio.com",
        projectId: "ses3a-be963",
        storageBucket: "ses3a-be963.appspot.com",
        messagingSenderId: "59904382974",
        appId: "1:59904382974:web:00a4af09e9daf4d57752af",
        measurementId: "G-5V80DL2H88"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    //TODO: configure this variable to false in the production stage
    //initialize this variable as 'true' during development stage
    //really login to test firebase related functions
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const currentUser = firebase.auth().currentUser;

    useEffect(() => {
        setIsLoggedIn(true);
    }, [currentUser]);


    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact strict render={ (props) => <VendorLoginPage {...props} />} />
                <Route path="/VendorLogin" exact strict render={ (props) => <VendorLoginPage {...props} />} />
                <Route path="/SupplierLogin" exact strict render={ (props) => <SupplierLoginPage {...props} />} />
                <Route path="/Vendor/:email"
                       render={ (props) =>
                           isLoggedIn ? <VendorLayout {...props}/> : <Redirect to="/"/>}
                />
                <Route path="/Supplier/:email"
                       render={ (props) =>
                           isLoggedIn ? <SupplierLayout {...props}/> : <Redirect to="/"/>}
                />
                <Route path="/VendorMyCart/:email" exact strict render={ (props) => <VendorMyCartPage {...props} />} />
                />
                <Route path="/VendorMyStock" exact strict render={ (props) => <VendorMyStockPage {...props} />} />
                />
                <Route path="/CreateNewUser" exact strict component={CreateNewUser} />
            </Switch>
        </BrowserRouter>
    );
}
