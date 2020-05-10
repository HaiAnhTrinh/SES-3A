import React, {useEffect, useState } from 'react';
import AccountCircle from "@material-ui/icons/AccountCircle";
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Menu from "@material-ui/core/Menu";
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from "@material-ui/core/MenuItem";
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';
import * as firebase from "firebase";
import { Route } from "react-router-dom";
import {drawer, layoutStyles, logout} from "../common/Layout";
import Home from "./SupplierHome";
import MyProduct from "./SupplierMyProduct";
import ProductSold from "./SupplierProductSold";
import Graph from "./SupplierGraph";
import Account from "./SupplierAccount";

export default function SupplierLayout(props) {
    const currentUser = firebase.auth().currentUser;
    const { container } = props;
    const classes = layoutStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [baseUrl, setBaseUrl] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const drawerListObject = [{
        'text': 'Home',
        'path': baseUrl + '/Home'
    }, {
        'text': 'My Product',
        'path': baseUrl + '/MyProduct'
    }, {
        'text': 'Product Sold',
        'path': baseUrl + '/ProductSold'
    }, {
        'text': 'Graph',
        'path': baseUrl + '/Graph'
    }, {
        'text': 'Account',
        'path': baseUrl + '/Account'
    }];

    useEffect(() => {
        firebase.auth().onAuthStateChanged( (user) => {
            setBaseUrl("/Supplier/" + user.email);
        });
    });

    const handleDrawerToggle = () => {
        // console.log("handleDrawerToggle", mobileOpen);
        setMobileOpen(!mobileOpen);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        // console.log("handle close");
        setAnchorEl(null);
    };

    const handleLogout = () => logout(props);

    const onItemClick = (variant) => {
        if(variant === "temporary"){
            handleDrawerToggle();
        }
    };

    const supplierDrawer = () => drawer(classes, drawerListObject, onItemClick);

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
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleClose}>Profile</MenuItem>
                                <MenuItem onClick={handleClose}>My account</MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </div>
                    </Toolbar>
                </AppBar>

                <nav className={classes.drawer}>
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                    <Hidden smUp implementation="css">
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
                            {supplierDrawer("temporary")}
                        </Drawer>
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
                        <Route path="/Supplier/:email/ProductSold" exact strict component={ProductSold}/>
                        <Route path="/Supplier/:email/Graph" exact strict component={Graph}/>
                        <Route path="/Supplier/:email/Account" exact strict component={Account}/>
                    </div>

                </main>
            </div>
        </React.Fragment>
    );
}