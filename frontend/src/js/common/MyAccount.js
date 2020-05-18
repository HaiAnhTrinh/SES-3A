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

export default function Account(props) {
    console.log("common myAccount: ", props);
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

    const [email, setEmail] = useState(props.match.params.email);
    const [username, setUsername] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [image, setImage] = useState([]);
    const [dropZoneOpen, setDropZoneOpen] = useState(false);
    const [loadingDialogOpen, setLoadingDialogOpen] = useState(false);
    const [updateMessage, setUpdateMessage] = useState(String);
    const [errorMessage, setErrorMessage] = useState(String);
    const [updateStatus, setUpdateStatus] = useState(Boolean);
    const [trigger, setTrigger] = useState("");
    const onUsernameChange = (event) => setUsername(event.target.value);
    const onAddressChange = (event) => setAddress(event.target.value);
    const onPhoneChange = (event) => setPhone(event.target.value);

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
        setImage(file);
        handleDropZoneClose();
    }

    const updateButtonClick = () => {
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

        imageRef.put(image[0]).on('state_changed', (snapshot) =>
            {
                setLoadingDialogOpen(true);
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },  (error) => {
                setLoadingDialogOpen(false);
                setUpdateStatus(false);
                setErrorMessage(error.toString());
            }, function () {
                setLoadingDialogOpen(false);
                imageRef.getDownloadURL().then( (url) => {
                    currentUser.updateProfile({photoURL: url})
                        .then(() => {
                            console.log("current user: ", currentUser);
                            setTrigger("");
                        });
                });

                Axios.post("http://localhost:8080/EditUserInfo",
                    data,
                    { headers: {'Content-Type': 'application/json'}})
                    .then((response) => {
                        if(response.data.status === "Success"){
                            setUpdateStatus(true);
                            setUpdateMessage(response.data.message);
                        }
                    })
                    .catch((err) => {
                        console.log("Error: ", err);
                        setUpdateStatus(false);
                        setErrorMessage(err.toString());
                    });
            }
        )
    }

    return(
        <div>
            <Modal open={loadingDialogOpen}>
                <CircularProgress size={50} variant="indeterminate" />
            </Modal>
            <Typography variant="h6" className={classes.title}>
                ACCOUNT PROFILE
            </Typography>
            <br/><br/>
            <div id="info">
                <Grid container spacing={3} alignItems="flex-end">
                    <Grid item xs={2}>
                        <Typography>
                            Email
                        </Typography>
                    </Grid>
                    <Grid item>
                        <TextField variant="standard"
                                   InputProps={{
                                       readOnly: true,
                                   }}
                                   value={email}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={3} alignItems="flex-end">
                    <Grid item xs={2}>
                        <Typography>
                            Username
                        </Typography>
                    </Grid>
                    <Grid item>
                        <TextField variant="standard"
                                   value={username}
                                   onChange={onUsernameChange}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={3} alignItems="flex-end">
                    <Grid item xs={2}>
                        <Typography>
                            Address
                        </Typography>
                    </Grid>
                    <Grid item>
                        <TextField variant="standard"
                                   value={address}
                                   onChange={onAddressChange}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={3} alignItems="flex-end">
                    <Grid item xs={2}>
                        <Typography>
                            Phone
                        </Typography>
                    </Grid>
                    <Grid item>
                        <TextField variant="standard"
                                   value={phone}
                                   onChange={onPhoneChange}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={3} alignItems="flex-end">
                    <Grid item xs={2}>
                        <Typography>
                            Profile image
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" onClick={handleDropZoneOpen}>
                            Add Image
                        </Button>
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
                <Button variant="outlined" color="primary" size="large" onClick={updateButtonClick}>
                    Update
                </Button>
            </div>
            {
                updateStatus ?
                    <div className={classes.updateMessage}>
                        {updateMessage}
                    </div>
                    :
                    <div className={classes.errorMessage}>
                        {errorMessage}
                    </div>
            }
        </div>
    );
}