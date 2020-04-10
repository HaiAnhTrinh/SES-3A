import React, { useState, useEffect } from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import '../../css/LoginPage.css';
import VendorLoginPage from "../vendor/VendorLoginPage"
import SupplierLoginPage from "../supplier/SupplierLoginPage";
import SupplierHomePage from "../supplier/SupplierHomePage";
import VendorHomePage from "../vendor/VendorHomePage";
import CreateNewUser from "./CreateNewUser";
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

    //initialize this variable as 'true' during development stage
    //change to 'false' during production to enable authentication
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(true);
        console.log("CURRENT USER:" ,firebase.auth().currentUser);
    }, [firebase.auth().currentUser]);

    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact strict render={ (props) => <VendorLoginPage {...props} />} />
                <Route path="/VendorLogin" exact strict render={ (props) => <VendorLoginPage {...props} />} />
                <Route path="/SupplierLogin" exact strict render={ (props) => <SupplierLoginPage {...props} />} />
                <Route path="/Vendor/HomePage" exact strict
                       render={ (props) =>
                           isLoggedIn ? <VendorHomePage {...props}/> : <Redirect to="/"/>}
                />
                <Route path="/Supplier/HomePage" exact strict
                       render={ (props) =>
                           isLoggedIn ? <SupplierHomePage {...props}/> : <Redirect to="/"/>}
                />
                <Route path="/CreateNewUser" exact strict component={CreateNewUser} />
            </Switch>
        </BrowserRouter>
    );
}