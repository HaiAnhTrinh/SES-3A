import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import { Link } from 'react-router-dom';
import LoginIcon from '../../image/LoginIcon.png';
import '../../css/LoginPage.css';
import * as firebase from "firebase";
import Axios from "axios";

function VendorLoginPage(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginMessage, setLoginMessage] = useState("");
    const onEmailChange = (event) => setEmail(event.target.value);
    const onPasswordChange = (event) => setPassword(event.target.value);

    const onLoginButtonClick = (e) => {
        e.preventDefault();

        if(email === "" || password === ""){
            setLoginMessage("Require both email and password");
        }
        else {
            //**************Authorization layer**************
            // firebase.auth().signInWithEmailAndPassword(email, password)
            //     .then((res) => {
            //
            //         if(res.user.emailVerified){
            //             Axios.get("http://localhost:8080/Login",
            //                 { headers: {'Content-Type': 'application/json', 'email': email, 'role': 'Business owner'}})
            //                 .then( (res) => {
            //                     console.log("Response: ",res);
            //                     if(res.data.isAuthorized){
            //                         props.history.push("/Vendor/"+ email + "/Home");
            //                     }
            //                     else{
            //                         setLoginMessage("This account is not a business owner account");
            //                     }
            //                 })
            //                 .catch( (err) => {
            //                     console.log("Error: ", err);
            //                     setLoginMessage("CONNECTION ERROR");
            //                 });
            //
            //         }
            //         else{
            //             setLoginMessage("Email not verified");
            //         }
            //     })
            //     .catch((error) => setLoginMessage(error.message));
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((res) => {
                    if(res.user.emailVerified){
                        props.history.push("/Vendor/"+ email + "/Home");
                    }
                    else{
                        setLoginMessage("Email not verified");
                    }
                })
                .catch((error) => setLoginMessage(error.message));
        }
    };

    return (
        <div className="outerDiv">
            <div>
                <img src={LoginIcon} alt="Login Icon" sizes="100px"/>
            </div>
            <form>
                <h1 className="header">BUSINESS OWNER LOGIN</h1>
                <TextField required label="email" variant="filled" onChange={onEmailChange}/>
                <br/><br/>
                <TextField required type="password" label="password" variant="filled" onChange={onPasswordChange}/>
                <br/><br/>
                <Button type="submit" variant="contained" color="primary" size="large" onClick={onLoginButtonClick}>
                    Login
                </Button>
            </form>

            <div>
                <br/>
                <Link to="/SupplierLogin">Login as a supplier?</Link>
                <br/>
                <Link to="/CreateNewUser">Create a new user</Link>
            </div>
            <div className="errorMessage">
                <br/>
                {loginMessage}
            </div>
        </div>
    );
}

export default VendorLoginPage;