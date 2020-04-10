import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import { Link } from 'react-router-dom';
import LoginIcon from '../../image/LoginIcon.png';
import '../../css/LoginPage.css';
import Axios from "axios";
import * as firebase from "firebase";

function SupplierLoginPage(props) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loginMessage, setLoginMessage] = useState("");
    const onEmailChange = (event) => setEmail(event.target.value);
    const onPasswordChange = (event) => setPassword(event.target.value);

    const onLoginButtonClick = (e) => {
        e.preventDefault();

        if(email == null || password == null){
            setLoginMessage("Require both email and password");
        }
        else{
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((res) => {
                    if(res.user.emailVerified){
                        props.history.push("/Supplier/HomePage");
                    }
                    else{
                        setLoginMessage("Email not verified");
                    }
                    console.log(res);
                })
                .catch((error) => setLoginMessage(error.message));
            // Axios.get("http://localhost:8080/Login",
            //     { headers: {'Content-Type': 'application/json', 'username': username, 'password': password}})
            //     .then( (res) => {
            //         console.log("Response: ",res);
            //         const status = res.data.status;
            //         if(status === "Success"){
            //             props.handleLogin(status);
            //             props.history.push("/SupplierHomePage");
            //         }
            //         else{
            //             setLoginMessage("Incorrect username or password");
            //         }
            //     })
            //     .catch( (err) => {
            //         console.log("Error: ", err);
            //         setLoginMessage("CONNECTION ERROR.");
            //     });
        }
    };
    return (
        <div className="outerDiv">
            <div>
                <img src={LoginIcon} alt="Login Icon"/>
            </div>
            <form>
                <h1 className="header">SUPPLIER LOGIN</h1>
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
                <Link to="/VendorLogin">Login as a business owner?</Link>
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

export default SupplierLoginPage;