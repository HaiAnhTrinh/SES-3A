import React from 'react';
import Button from '@material-ui/core/Button';
import { fade, makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import FavoriteIcon from '@material-ui/icons/Favorite';
import InfoIcon from '@material-ui/icons/Info';
import SearchIcon from '@material-ui/icons/Search';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Axios from "axios";


const useStyles = makeStyles((theme) => ({

    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '100%',
        },
    },

    rootGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: "auto",
        height: "auto",
        transform: 'translateZ(0)',
    },
    titleBar: {
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' + 'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    icon: {
        color: '#CACACB', // Was white
    },

    root1: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),

    },
    title: {
        flexGrow: 1,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',

        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,

    },
    selectEmpty: {
        marginTop: theme.spacing(1),
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '15ch', // Was 12
            '&:focus': {
                width: '20ch',
            },
        },
    },


    image: {
        position: 'relative',
        height: 200,
        [theme.breakpoints.down('xs')]: {
            width: '100% !important',
            height: 100,
        },
        '&:hover, &$focusVisible': {
            zIndex: 1,
            '& $imageBackdrop': {
                opacity: 0.15,
            },
            '& $imageMarked': {
                opacity: 0,
            },
            '& $imageTitle': {
                border: '4px solid currentColor',
            },
        },
    },
    focusVisible: {},
    imageButton: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.common.white,
    },
    imageSrc: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
    },
    imageBackdrop: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: theme.palette.common.black,
        opacity: 0.4,
        transition: theme.transitions.create('opacity'),
    },
    imageTitle: {
        position: 'relative',
        padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${theme.spacing(1) + 6}px`,
    },
    imageMarked: {
        height: 3,
        width: 18,
        backgroundColor: theme.palette.common.white,
        position: 'absolute',
        bottom: -2,
        left: 'calc(50% - 9px)',
        transition: theme.transitions.create('opacity'),
    },
}));

const images = [
    {
        url: 'https://media-exp1.licdn.com/dms/image/C4E1BAQEsM9i7d4AXQg/company-background_10000/0?e=2159024400&v=beta&t=Q7IUN3ypEGz2t1xfsdg9t9bglxVgiOJ0V0WoPzAIZQw',
        title: 'Food',
        width: '30%',
    },
    {
        url: 'https://www.spellbrand.com/wp-content/uploads/2012/12/beauty-salon-spa-business1.jpg',
        title: 'Service',
        width: '30%',
    },
    {
        url: 'https://alltopstartups.com/wp-content/uploads/2016/09/Retail-Business.png',
        title: 'Retail',
        width: '30%',
    },
];

export default function Home(){
    console.log("VENDOR HOME");
    const [openSave, setOpenSave] = React.useState(false);
    const [openOptions, setOpenOptions] = React.useState(false);
    const [openProduct, setOpenProduct] = React.useState(false);
    const [tileData, setTileData] = React.useState([]);

    const handleClickOpenOptions = () => {
        setOpenOptions(true);

    };

    const handleClickOpenProduct = () => {
        setOpenProduct(true);
    };
    const handleCloseOptions = () => {
        console.log("Category: ", category);
        Axios.get("http://localhost:8080/GetProductByCategory",
            { headers: {'Content-Type': 'application/json', 'email': "vendor@gmail", 'category': category}})
            .then( (res) => {
                console.log("Response: ",res);
                setTileData(res.data.products);
            })
            .catch( (err) => {
                console.log("Error: ", err);
            });
        setOpenOptions(false);
    };
    const handleCloseProduct = () => {
        setOpenProduct(false);
    };

    const [checkedff, setCheckedff] = React.useState(false);
    const [checkedc, setCheckedc] = React.useState(false);
    const [checkedb, setCheckedb] = React.useState(false);
    const [checkedh, setCheckedh] = React.useState(false);
    const [checkedcl, setCheckedcl] = React.useState(false);
    const [checkeds, setCheckeds] = React.useState(false);
    const [checkeda, setCheckeda] = React.useState(false);
    const [checkedm, setCheckedm] = React.useState(false);
    const [checkedp, setCheckedp] = React.useState(false);
    const [checkedj, setCheckedj] = React.useState(false);
    const [checkedg, setCheckedg] = React.useState(false);
    const [checkedr, setCheckedr] = React.useState(false);
    const [checkedt, setCheckedt] = React.useState(false);
    const [checkedd, setCheckedd] = React.useState(false);
    const [checkedfit, setCheckedfit] = React.useState(false);

    const [category, setCategory] = React.useState("");

    const handleChangeFastFood = (event) => {
        console.log("Event:", event.target.value);
        setCheckedff(event.target.checked);
        setCategory(event.target.value);
    };
    const handleChangeCafe = (event) => {
        setCheckedc(event.target.checked);
    };
    const handleChangeBakery = (event) => {
        setCheckedb(event.target.checked);
    };
    const handleChangeHair = (event) => {
        setCheckedh(event.target.checked);
    };
    const handleChangeClothing = (event) => {
        setCheckedcl(event.target.checked);
    };
    const handleChangeSkin = (event) => {
        setCheckeds(event.target.checked);
    };
    const handleChangeAccessories = (event) => {
        setCheckeda(event.target.checked);
    };
    const handleChangeMakeup = (event) => {
        setCheckedm(event.target.checked);
    };
    const handleChangePharmacy = (event) => {
        setCheckedp(event.target.checked);
    };
    const handleChangeJuice = (event) => {
        setCheckedj(event.target.checked);
    };
    const handleChangeGrocery = (event) => {
        setCheckedg(event.target.checked);
    };
    const handleChangeRestaurant = (event) => {
        setCheckedr(event.target.checked);
    };
    const handleChangeTechStore = (event) => {
        setCheckedt(event.target.checked);
    };
    const handleChangeDepStore = (event) => {
        setCheckedd(event.target.checked);
    };
    const handleChangeFitnessGym = (event) => {
        setCheckedfit(event.target.checked);
    };

    const [sortBy, setSortBy] = React.useState('min');

    const handleChange = (event) => {
        setSortBy(event.target.value);
    };

    const classes = useStyles();
    return(
        <div >
            <div >
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
                <AppBar position="static" >
                    <Tabs
                        color="primary"
                    >Change Business Options
                        <Tab label="Change Business Options" onClick={handleClickOpenOptions}/>
                        <Tab label="" />
                        <IconButton className={classes.icon}>
                            <FavoriteIcon />
                        </IconButton>
                        <Tab label="" />
                        <div>
                            <FormControl className={classes.formControl} >
                                <InputLabel  >Sort By</InputLabel>
                                <Select
                                    value={sortBy}
                                    onChange={handleChange}
                                >
                                    <MenuItem value={"min"}>Price Low ($AUD)</MenuItem>
                                    <MenuItem value={"max"}>Price High ($AUD)</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <Toolbar>
                            <div className={classes.search}>
                                <div className={classes.searchIcon}>
                                    <SearchIcon />
                                </div>
                                <InputBase
                                    placeholder="Search…"
                                    classes={{
                                        root1: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </div>
                        </Toolbar>
                    </Tabs>
                </AppBar>
                <div className={classes.rootGrid} style={{width: 'auto', height: 'auto'}}>
                    <GridList cellHeight={200} spacing={1} className={classes.gridList} cols={4}>
                        {tileData.map(tile => (
                            <GridListTile key="https://firebasestorage.googleapis.com/v0/b/ses3a-be963.appspot.com/o/product%20photos%2Ffusion-featherjet-plus-hairdryer.jpg?alt=media&token=a6d56af5-edb1-47da-9e7a-674c94e2a637" >
                                <img src="https://firebasestorage.googleapis.com/v0/b/ses3a-be963.appspot.com/o/product%20photos%2Ffusion-featherjet-plus-hairdryer.jpg?alt=media&token=a6d56af5-edb1-47da-9e7a-674c94e2a637"
                                     alt={tile.productName} onClick={handleClickOpenProduct}
                                />
                                <GridListTileBar
                                    title={tile.title}
                                    titlePosition="top"
                                    className={classes.titleBar}

                                />

                                <GridListTileBar
                                    height={4}
                                    title={tile.productPrice}
                                    subtitle={<span>By: {tile.supplierEmail} </span>}
                                    actionIcon={
                                        <IconButton aria-label={`info about ${tile.productName}`} className={classes.icon}>
                                            <FavoriteIcon />
                                        </IconButton>
                                    }
                                />

                            </GridListTile>
                        ))}
                    </GridList>
                </div>

                <Dialog open={openProduct} onClose={handleCloseProduct} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Product Details</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <div>
                                Product image
                            </div>
                            <div className={classes.root}>

                                <Button onClick={handleCloseProduct}
                                        variant="contained"
                                        color="primary"
                                >Close
                                </Button>
                                <br></br>
                            </div>
                        </DialogContentText>
                    </DialogContent>
                </Dialog>









                <Dialog open={openOptions} onClose={handleCloseOptions} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Change Business Options</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            What kind of businesses do you run/ plan to run?
                            <div className={classes.root}>
                                {images.map((image) => (
                                    <ButtonBase
                                        focusRipple
                                        key={image.title}
                                        className={classes.image}
                                        focusVisibleClassName={classes.focusVisible}
                                        style={{
                                            width: image.width,
                                        }}
                                    >
          <span
              className={classes.imageSrc}
              style={{
                  backgroundImage: `url(${image.url})`,
              }}
          />
                                        <span className={classes.imageBackdrop} />
                                        <span className={classes.imageButton}>
            <Typography
                component="span"
                variant="subtitle1"
                color="inherit"
                className={classes.imageTitle}
            >
              {image.title}
                <span className={classes.imageMarked} />
            </Typography>
          </span>
                                    </ButtonBase>
                                ))}
                            </div>
                            <div>
                                <TableContainer align={'center'} >
                                    <Table  aria-label="customized table">
                                        <TableHead>
                                            <TableRow >
                                                <TableCell>Choose Food options</TableCell>
                                                <TableCell>Choose Service Options</TableCell>
                                                <TableCell>Choose Retail Options</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow >
                                                <TableCell >
                                                    <Checkbox
                                                        checked={checkedff}
                                                        onChange={handleChangeFastFood}
                                                        value="fastfood"
                                                        inputProps={{ 'aria-label': 'fastFood' }}/>Fast Food
                                                </TableCell>
                                                <TableCell >
                                                    <Checkbox
                                                        checked={checkedh}
                                                        onChange={handleChangeHair}
                                                        inputProps={{ 'aria-label': 'hair' }}/>Hairdressing
                                                </TableCell>
                                                <TableCell >
                                                    <Checkbox
                                                        checked={checkedcl}
                                                        onChange={handleChangeClothing}
                                                        inputProps={{ 'aria-label': 'clothing' }}/>Clothing/ Shoes
                                                </TableCell>
                                            </TableRow>
                                            <TableRow >
                                                <TableCell >
                                                    <Checkbox
                                                        checked={checkedc}
                                                        onChange={handleChangeCafe}
                                                        inputProps={{ 'aria-label': 'cafe' }}/>Café
                                                </TableCell>
                                                <TableCell >
                                                    <Checkbox
                                                        checked={checkeds}
                                                        onChange={handleChangeSkin}
                                                        inputProps={{ 'aria-label': 'skin' }}/>Dermatology
                                                </TableCell>
                                                <TableCell >
                                                    <Checkbox
                                                        checked={checkeda}
                                                        onChange={handleChangeAccessories}
                                                        inputProps={{ 'aria-label': 'accessories' }}/>Accessories
                                                </TableCell>
                                            </TableRow>
                                            <TableRow >
                                                <TableCell >
                                                    <Checkbox
                                                        checked={checkedb}
                                                        onChange={handleChangeBakery}
                                                        inputProps={{ 'aria-label': 'bakery' }}/>Bakery
                                                </TableCell>
                                                <TableCell >
                                                    <Checkbox
                                                        checked={checkedm}
                                                        onChange={handleChangeMakeup}
                                                        inputProps={{ 'aria-label': 'makeup' }}/>Makeup
                                                </TableCell>
                                                <TableCell >
                                                    <Checkbox
                                                        checked={checkedp}
                                                        onChange={handleChangePharmacy}
                                                        inputProps={{ 'aria-label': 'pharmacy' }}/>Pharmacy
                                                </TableCell>

                                            </TableRow>
                                            <TableRow >
                                                <TableCell >
                                                    <Checkbox
                                                        checked={checkedj}
                                                        onChange={handleChangeJuice}
                                                        inputProps={{ 'aria-label': 'juice' }}/>Drinks/ Juice
                                                </TableCell>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={checkedfit}
                                                        onChange={handleChangeFitnessGym}
                                                        inputProps={{ 'aria-label': 'fitnessGym' }}/>Fitness Gym
                                                </TableCell>
                                                <TableCell >
                                                    <Checkbox
                                                        checked={checkedg}
                                                        onChange={handleChangeGrocery}
                                                        inputProps={{ 'aria-label': 'grocery' }}/>Grocery Store
                                                </TableCell>
                                            </TableRow>

                                            <TableCell >
                                                <Checkbox
                                                    checked={checkedr}
                                                    onChange={handleChangeRestaurant}
                                                    inputProps={{ 'aria-label': 'restaurant' }}/>Restaurant
                                            </TableCell>

                                            <TableCell>

                                            </TableCell>
                                            <TableCell >
                                                <Checkbox
                                                    checked={checkedt}
                                                    onChange={handleChangeTechStore}
                                                    inputProps={{ 'aria-label': 'techstore' }}/>Tech Store
                                            </TableCell>
                                            <TableRow>
                                                <TableCell >

                                                </TableCell>
                                                <TableCell>
                                                </TableCell>
                                                <TableCell >
                                                    <Checkbox
                                                        checked={checkedd}
                                                        onChange={handleChangeDepStore}
                                                        inputProps={{ 'aria-label': 'department' }}/>Department Store
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                            <div align={'center'}>

                                {'\n'}<br></br>
                                <Button onClick={handleCloseOptions}
                                        variant="contained"
                                        color="primary"
                                >Save Options
                                </Button>
                                <br></br>
                            </div>
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
                <br></br>
            </div>
        </div>

    );
}
