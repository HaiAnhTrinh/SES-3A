import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import '../css/LoginPage.css';
import VendorLoginPage from "./VendorLoginPage"
import SupplierLoginPage from "./SupplierLoginPage";

export default function LoginRouter() {
    return (
        <BrowserRouter>
            <Route path="/" exact strict >
                <VendorLoginPage/>
            </Route>
            <Route path="/VendorLogin" exact strict >
                <VendorLoginPage/>
            </Route>
            <Route path="/SupplierLogin" exact strict >
                <SupplierLoginPage/>
            </Route>
        </BrowserRouter>
    );
}