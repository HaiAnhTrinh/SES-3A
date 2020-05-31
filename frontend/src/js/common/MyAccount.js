import React, {useEffect, useState} from "react";
import Axios from "axios";
import * as firebase from "firebase";
import Button from "@material-ui/core/Button";
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import Modal from '@material-ui/core/Modal';
import TextField from "@material-ui/core/TextField";
import Typography from '@material-ui/core/Typography';
import {DropzoneDialog} from 'material-ui-dropzone';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

export default function Account(props) {
    const profileImageRef = firebase.storage().ref().child("profile images");
    const currentUser = firebase.auth().currentUser;

    const useStyles = makeStyles( (theme) => ({
        title: {
            flexGrow: 1,
        },
        updateMessage: {
            color: "InfoText",
        },
        errorMessage: {
            color: "indianred",
        }
    }));
    const classes = useStyles();

    useEffect( () => {
        console.log("useEffect");
        getData();
    }, []);

    const [email] = useState(props.match.params.email);
    const [username, setUsername] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [image, setImage] = useState([]);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [dropZoneOpen, setDropZoneOpen] = useState(false);
    const [loadingDialogOpen, setLoadingDialogOpen] = useState(false);
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [updateProfileMessage, setUpdateProfileMessage] = useState(String);
    const [errorMessage, setErrorMessage] = useState(String);
    const [updateProfileStatus, setUpdateProfileStatus] = useState(Boolean);
    const [updatePasswordMessage, setUpdatePasswordMessage] = useState(String);
    const [updatePasswordStatus, setUpdatePasswordStatus] = useState(Boolean);
    const onUsernameChange = (event) => setUsername(event.target.value);
    const onAddressChange = (event) => setAddress(event.target.value);
    const onPhoneChange = (event) => setPhone(event.target.value);
    const onPasswordChange = (event) => setPassword(event.target.value);
    const onConfirmPasswordChange = (event) => setConfirmPassword(event.target.value);

    const getData = () => {
        Axios.get("http://localhost:8080/GetUserInfo",
            { headers: {'Content-Type': 'application/json', 'email': email, 'role': props.role}})
            .then(response => {
                console.log(response);
                initData(response.data.userInfo.username, response.data.userInfo.address, response.data.userInfo.phone);
            })
            .catch(error => console.log(error));
    }

    const initData = (username, address, phoneNumber) => {
        setUsername(username);
        setAddress(address);
        setPhone(phoneNumber);
    }

    const handleDropZoneOpen = () => {
        setDropZoneOpen(true);
    }

    const handleDropZoneClose = () => {
        setDropZoneOpen(false);
    }

    const handleDropZoneSave = (file) => {
        console.log("DROP ZONE SAVE");
        console.log("image file: ", file);
        setImage(file);
        handleDropZoneClose();
    }

    const updateDetailBtnClick = () => {
        console.log("EDIT BUTTON CLICKED");
        console.log("Image: ", image[0]);
        const data = {
            "email": email,
            "role": props.role,
            "username": username,
            "address": address,
            "phone": phone,
        }
        const imageRef = profileImageRef.child(email);

        Axios.post("http://localhost:8080/EditUserInfo",
            data,
            { headers: {'Content-Type': 'application/json'}})
            .then((response) => {
                if(response.data.status === "Success"){
                    setUpdateProfileStatus(true);
                    setUpdateProfileMessage(response.data.message);
                }
            })
            .catch((err) => {
                console.log("Error: ", err);
                setUpdateProfileStatus(false);
                setErrorMessage(err.toString());
            });

        imageRef.put(image[0]).on('state_changed', (snapshot) =>
            {
                setLoadingDialogOpen(true);
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            }, (error) => {
                setLoadingDialogOpen(false);
                setUpdateProfileStatus(false);
                setErrorMessage(error.toString());
            },  () => {
                setLoadingDialogOpen(false);
                imageRef.getDownloadURL().then( (url) => {
                    currentUser.updateProfile({photoURL: url})
                        .then(() => {
                            console.log("current user: ", currentUser);
                        });
                });
            }
        )
    }

    const updatePasswordBtnClick = () => {
        setPasswordDialogOpen(true);
    }

    const passwordDialogClose = () => {
        setPasswordDialogOpen(false);
    }

    const saveNewPassword = () => {
        currentUser.updatePassword(password)
            .then(() => {
                setUpdatePasswordMessage("Password updated!!!")
            })
            .catch((error) => {
                setUpdatePasswordMessage(error);
            });
        setUpdatePasswordStatus(true);
    }

    return(
        <div>
            <Modal open={loadingDialogOpen}>
                <CircularProgress size={50} variant="indeterminate" />
            </Modal>

            <Dialog onClose={passwordDialogClose} open={passwordDialogOpen}>
                <DialogTitle onClose={passwordDialogClose}>
                    Change Password
                </DialogTitle>
                <DialogContent dividers>
                    <TextField required type="password" label="new password"
                               variant="filled" helperText="At least 6 characters" onChange={onPasswordChange}/>
                    <br/><br/>
                    <TextField required type="password" label="confirm password"
                               variant="filled" onChange={onConfirmPasswordChange}/>
                    { updatePasswordStatus ?
                        <div className={classes.updateMessage}>
                            {updatePasswordMessage}
                        </div>
                        :
                        <p/>
                    }
                </DialogContent>
                <DialogActions>
                    { password.length >= 6 && password === confirmPassword ?
                        <Button onClick={saveNewPassword} color="primary">
                            Update
                        </Button>
                        :
                        <p/>
                    }
                </DialogActions>
            </Dialog>

            <Typography variant="h6" className={classes.title}>
                ACCOUNT PROFILE
            </Typography>
            <br/><br/>
            <div id="info">
                <Grid container spacing={3} alignItems="flex-end">
                    <Grid item xs={2}>
                        <Typography color="primary">Email</Typography>
                    </Grid>
                    <Grid item>
                        <TextField variant="standard"
                                   InputProps={{readOnly: true,}}
                                   value={email}/>
                    </Grid>
                </Grid>
                <Grid container spacing={3} alignItems="flex-end">
                    <Grid item xs={2}>
                        <Typography color="primary">Username</Typography>
                    </Grid>
                    <Grid item>
                        <TextField variant="standard"
                                   value={username}
                                   onChange={onUsernameChange}/>
                    </Grid>
                </Grid>
                <Grid container spacing={3} alignItems="flex-end">
                    <Grid item xs={2}>
                        <Typography color="primary">Address</Typography>
                    </Grid>
                    <Grid item>
                        <TextField variant="standard"
                                   value={address}
                                   onChange={onAddressChange}/>
                    </Grid>
                </Grid>
                <Grid container spacing={3} alignItems="flex-end">
                    <Grid item xs={2}>
                        <Typography color="primary">Phone</Typography>
                    </Grid>
                    <Grid item>
                        <TextField variant="standard"
                                   value={phone}
                                   onChange={onPhoneChange}/>
                    </Grid>
                </Grid>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={2}>
                        <Typography color="primary">Profile image</Typography>
                        <br/>
                        {currentUser && currentUser.photoURL ?
                            <Typography>(Click the image to edit)</Typography> : <p/>
                        }
                    </Grid>
                    <Grid item>
                        { currentUser && currentUser.photoURL ?
                            <img src={currentUser.photoURL}
                                 alt="user profile"
                                 width="200" height="150"
                                 onClick={handleDropZoneOpen}
                            />
                            :
                            <Button variant="outlined" onClick={handleDropZoneOpen}>
                                Add Image
                            </Button>
                        }
                        <DropzoneDialog
                            open={dropZoneOpen}
                            onSave={handleDropZoneSave}
                            acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                            showPreviews={true}
                            filesLimit={1}
                            maxFileSize={5000000}
                            initialFiles={image}
                            onClose={handleDropZoneClose}
                        />
                    </Grid>
                </Grid>
            </div>
            <br/>
            <div>
                <br/>
                <Grid container spacing={1}>
                    <Grid item>
                        <Button variant="outlined" color="primary" size="large" onClick={updateDetailBtnClick}>
                            Update Details
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" color="primary" size="large" onClick={updatePasswordBtnClick}>
                            Update Password
                        </Button>
                    </Grid>
                </Grid>
            </div>
            {
                updateProfileStatus ?
                    <div className={classes.updateMessage}>
                        {updateProfileMessage}
                    </div>
                    :
                    <div className={classes.errorMessage}>
                        {errorMessage}
                    </div>
            }
        </div>
    );
}