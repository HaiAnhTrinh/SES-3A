import React, {useEffect, useState } from 'react';
import AccountCircle from "@material-ui/icons/AccountCircle";
import AppBar from '@material-ui/core/AppBar';
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from "@material-ui/core/Divider";
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from "@material-ui/core/MenuItem";
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';

import * as firebase from "firebase";
import {Link, Route} from "react-router-dom";
import {layoutStyles, logout} from "../common/Layout";
import Home from "./SupplierHome";
import MyProduct from "./SupplierMyProduct";
import DeliveredProduct from "./SupplierDeliveredProduct";
import Graph from "./SupplierGraph";
import Account from "../common/MyAccount";
import Logo from "../../image/Logo.png";


export default function SupplierLayout(props) {
    const currentUser = firebase.auth().currentUser;
    const { container } = props;
    const classes = layoutStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [baseUrl, setBaseUrl] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const drawerListObject = [{
        'text': 'Home',
        'path': baseUrl + '/Home'
    }, {
        'text': 'My Product',
        'path': baseUrl + '/MyProduct'
    },
    //     {
    //     'text': 'Delivered Product',
    //     'path': baseUrl + '/DeliveredProduct'
    // },
        {
        'text': 'Graph',
        'path': baseUrl + '/Graph'
    }];

    useEffect(() => {
        firebase.auth().onAuthStateChanged( (user) => {
            setBaseUrl("/Supplier/" + user.email);
        });
    });

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => logout(props);

    const handleMyAccount = () => {
        props.history.push(baseUrl + "/MyAccount");
        handleClose();
    };

    const supplierDrawer = () => {
        return(
            <div>
                <div className={classes.toolbar}>
                    <img src={Logo} alt="Logo" className={classes.logo}/>
                </div>
                <Divider/>
                <List>
                    {drawerListObject.map((object, index) => (
                        <ListItem selected={index === selectedIndex} button key={object.text}
                                  component={Link} to={object.path}
                                  onClick={() => setSelectedIndex(index)}>
                            <ListItemText primary={object.text}/>
                        </ListItem>
                    ))}
                </List>
            </div>
        )
    }

    return (
        <React.Fragment>
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            className={classes.menuButton}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            { currentUser ? currentUser.displayName : ""}
                        </Typography>
                        <div>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                { currentUser && currentUser.photoURL ?
                                    <Avatar alt="avatar" src={currentUser.photoURL} />
                                    :
                                    <AccountCircle />
                                }
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={classes.anchorOrigin}
                                keepMounted
                                transformOrigin={classes.transformOrigin}
                                open={open}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleMyAccount}>My account</MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </div>
                    </Toolbar>
                </AppBar>

                <nav className={classes.drawer}>
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                    <Hidden smUp implementation="css">
                        <div onClick={handleDrawerToggle}>
                            <Drawer
                                container={container}
                                variant="temporary"
                                anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                                open={mobileOpen}
                                onClose={handleDrawerToggle}
                                classes={{
                                    paper: classes.drawerPaper,
                                }}
                                ModalProps={{
                                    keepMounted: true, // Better open performance on mobile.
                                }}
                            >
                                {supplierDrawer()}
                            </Drawer>
                        </div>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                        <Drawer
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            variant="permanent"
                            open
                        >
                            {supplierDrawer()}
                        </Drawer>
                    </Hidden>
                </nav>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <div>
                        <Route path="/Supplier/:email/Home" exact strict component={Home}/>
                        <Route path="/Supplier/:email/MyProduct" exact strict component={MyProduct}/>
                        <Route path="/Supplier/:email/DeliveredProduct" exact strict component={DeliveredProduct}/>
                        <Route path="/Supplier/:email/Graph" exact strict component={Graph}/>
                        <Route path="/Supplier/:email/MyAccount" exact strict>
                            <Account {...props} role="Supplier" />
                        </Route>
                    </div>

                </main>
            </div>
        </React.Fragment>
    );
}