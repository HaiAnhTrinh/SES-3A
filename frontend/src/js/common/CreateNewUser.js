import React, { useState } from 'react';
import Axios from "axios";
import { createStyles, makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import FormControl from "@material-ui/core/FormControl"
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import "../../css/CreateNewUser.css";
import { Link } from 'react-router-dom';
import * as firebase from "firebase";

export default function CreateNewUser() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [registerMessage, setRegisterMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const onUsernameChange = (event) => setUsername(event.target.value);
    const onPasswordChange = (event) => setPassword(event.target.value);
    const onConfirmPasswordChange = (event) => setConfirmPassword(event.target.value);
    const onEmailChange = (event) => setEmail(event.target.value);
    const onRoleChange = (event) => setRole(event.target.value);

    const useStyles = makeStyles(() =>
        createStyles({
            formControl: {
                minWidth: 207,
            },
        }),
    );
    const classes = useStyles();

    const sendDataToBackEnd = () => {
        const data = {
            "username": username,
            "email": email,
            "role": role
        };
        // Axios.interceptors.request.use(request => {
        //     console.log('Starting Request', request)
        //     return request
        // });
        Axios.post("http://localhost:8080/CreateNewUser",
            data,
            { headers: {'Content-Type': 'application/json'}})
            .then((response) => console.log(response)
            )
            .catch((err) => console.log("Error: ", err));
    };

    const onRegisterButtonClick = (e) => {
        e.preventDefault();
        console.log(username , password, confirmPassword, email, role);
        if( username === "" || password === "" || confirmPassword === "" || email === "" || role === ""){
            setRegisterMessage("All fields must be filled");
        }
        else if( password.length < 6){
            setRegisterMessage("Password must be at least 6 characters");
        }
        else if( password !== confirmPassword){
            setRegisterMessage("ConfirmPassword field must match Password");
        }
        else{
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(() => {
                    const user = firebase.auth().currentUser;
                    user.sendEmailVerification()
                        .then(() => {
                            setRegisterMessage("Register successful");
                            setIsSuccess(true);
                            sendDataToBackEnd();
                            console.log("Verification email sent");
                        })
                        .catch((error) => {
                            setRegisterMessage(error.message);
                        });
                    user.updateProfile({displayName: username})
                        .catch((error) => console.log(error));
                })
                .catch((error) => {
                    console.log(error);
                    setRegisterMessage(error.message);
                });
        }
    };

    return (
        <div className="outerDiv">
            <form>
                <h1 className="header">CREATE A NEW USER</h1>
                <TextField required label="email" variant="filled" onChange={onEmailChange} />
                <br/><br/>
                <TextField required label="username" variant="filled" onChange={onUsernameChange}/>
                <br/><br/>
                <TextField required type="password" label="password" variant="filled" onChange={onPasswordChange}/>
                <br/><br/>
                <TextField required type="password" label="confirm password" variant="filled" onChange={onConfirmPasswordChange}/>
                <br/><br/>
                <FormControl required variant="filled" className={classes.formControl}>
                    <InputLabel>role</InputLabel>
                    <Select value={role} onChange={onRoleChange}>
                        <MenuItem value="Business owner">Business owner</MenuItem>
                        <MenuItem value="Supplier">Supplier</MenuItem>
                    </Select>
                </FormControl>
                <br/><br/>
                <Button type="submit" variant="contained" color="primary" size="large" onClick={onRegisterButtonClick}>
                    Register
                </Button>
            </form>
            <div className="errorMessage">
                {registerMessage}
            </div>
            <br/>
            { isSuccess ? (
                <div>
                    { (role === "Business owner")
                        ? <Link to="/VendorLogin">Go back to the {role} login page</Link>
                        : <Link to="/SupplierLogin">Go back to the {role} login page</Link>
                    }
                </div>
                ) :
                <div>
                    <Link to="/">Go back to login page</Link>
                </div>
            }

        </div>
    );
}