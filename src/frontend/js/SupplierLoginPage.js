import React, { useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import { Link } from 'react-router-dom';
import LoginIcon from '../image/LoginIcon.png';
import '../css/LoginPage.css';

function SupplierLoginPage() {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const onUsernameChange = (event) => setUsername(event.target.value);
    const onPasswordChange = (event) => setPassword(event.target.value);
    const onLoginButtonClick = () => {
        //TODO: send username and password to backend for authentication
        console.log(username + password);
    };
    return (
            <div className="outerDiv">
                <div>
                    <img src={LoginIcon} alt="Login Icon"/>
                </div>
                <form>
                    <h1 className="header">Supplier Login</h1>
                    <TextField className="username" id="filled-basic" label="username" variant="filled" onChange={onUsernameChange}/>
                    <br/><br/>
                    <TextField className="password" type="password" label="password" variant="filled" onChange={onPasswordChange}/>
                    <br/><br/>
                    <Button type="submit" variant="contained" color="primary" onClick={onLoginButtonClick}>
                        Login
                    </Button>
                </form>
                <div>
                    <Link to="/VendorLogin">Login as a business owner?</Link>
                </div>
            </div>
    );
}

export default SupplierLoginPage;