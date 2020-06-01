import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import * as firebase from "firebase";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {Link} from "react-router-dom";
import ListItemText from "@material-ui/core/ListItemText";
import Logo from "../../image/Logo.png";

const drawerWidth = 240;

export const layoutStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    title: {
        flexGrow: 1,
    },
    logo: {
        width: drawerWidth,
        height: 58,
    },
    anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
    },
    transformOrigin: {
        vertical: 'top',
        horizontal: 'right',
    }
}));

export const logout = (props) => {
    firebase.auth().signOut()
        .then( () => {
            props.history.push("/");
        })
        .catch( (error) => console.log(error));
};

export const drawer = (classes, drawerListObject, onItemClick) => {
    return(
        <div>
            <div className={classes.toolbar}>
                <img src={Logo} alt="Logo" className={classes.logo}/>
            </div>
            <Divider/>
            <List>
                {drawerListObject.map((object, index) => (
                    <ListItem button key={object.text} component={Link} to={object.path} onClick={onItemClick}>
                        <ListItemText primary={object.text}/>
                    </ListItem>
                ))}
            </List>
        </div>
    );
};