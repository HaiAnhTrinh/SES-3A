import React, {useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from '@material-ui/core/Typography';
import Axios from "axios";

export default function Account(props) {

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

    const [email, setEmail] = useState(props.match.params.email);
    const [username, setUsername] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [updateMessage, setUpdateMessage] = useState(String);
    const [errorMessage, setErrorMessage] = useState(String);
    const [updateStatus, setUpdateStatus] = useState(Boolean);
    const onUsernameChange = (event) => setUsername(event.target.value);
    const onAddressChange = (event) => setAddress(event.target.value);
    const onPhoneChange = (event) => setPhone(event.target.value);

    const getData = () => {
        Axios.get("http://localhost:8080/GetUserInfo",
            { headers: {'Content-Type': 'application/json', 'email': email, 'role': 'Business owner'}})
            .then(response => {
                initData(response.data.username, response.data.address, response.data.phone);
            })
            .catch(error => console.log(error));
    }

    const initData = (username, address, phoneNumber) => {
        setUsername(username);
        setAddress(address);
        setPhone(phoneNumber);
    }

    const updateButtonClick = () => {
        console.log("EDIT BUTTON CLICKED");

        const data = {
            "email": email,
            "role": "Business owner",
            "username": username,
            "address": address,
            "phone": phone,
        }

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

    useEffect( () => {
        console.log("useEffect");
        getData();

    }, []);

    return(
      <div>
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
          </div>
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