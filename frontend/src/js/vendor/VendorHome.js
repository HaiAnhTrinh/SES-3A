import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import { fade, makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
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
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import FavoriteIcon from '@material-ui/icons/Favorite';
import Axios from "axios";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import { red } from '@material-ui/core/colors';
import '../../css/VendorHome.css'
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyles = makeStyles((theme) => ({
    root_product: {
        maxWidth: 320,
    },
    media: {
        height: 0,
    },
    avatar: {
        backgroundColor: red[500],
    },

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
        paddingLeft: 20,
        paddingRight: 20
    },
    gridListTileCredit: {
        top: 50,
        right: 10,
        fontSize: "large",
        fontWeight: "bolder",
        background: "black",
        position: "absolute",
        borderRadius: "60%",
    },
    titleBar: {
        width: "100%",
        position: "absolute",
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
    saveOptionButton: {
        top: 10
    }
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

export default function Home(props){
    console.log("VENDOR HOME");
    const theme = useTheme();
    const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
    const classes = useStyles();
    const email = props.match.params.email;
    const [openOptions, setOpenOptions] = useState(false);
    const [openProduct, setOpenProduct] = useState(false);
    const [openProductDetails, setOpenProductDetails] = useState({
        "productName": "",
        "productImageUrl": "",
        "productDescription" : "",
        "supplierEmail" : "",
        "productQuantity" : "",
        "productPrice" : "",
        "productCategory": "",
        "productCredit": ""
    });
    const [dataList, setDataList] = useState([]);
    const [checkList, setCheckList] = useState({
        fastfood: false,
        hairdressing: false,
        clothing: false,
        bakery: false,
        makeup: false,
        pharmacy: false
    })

    const handleClickOpenOptions = () => setOpenOptions(true)

    const handleClickOpenProduct = (event, tile) => {
        setOpenProduct(true);
        setOpenProductDetails({
            "productName": tile.productName,
            "productImageUrl": tile.productImageUrl,
            "productDescription" : tile.productDescription,
            "supplierEmail" : tile.supplierEmail,
            "productQuantity" : tile.productQuantity,
            "productPrice" : tile.productPrice,
            "productCategory": tile.productCategory,
            "productCredit": tile.productCredit
        });
    };

    const handleCloseOptions = () => {
        setOpenOptions(false);
    };

    const handleCloseProduct = () => setOpenProduct(false)

    const handleChangeOption = event => {
        setCheckList({ ...checkList, [event.target.value]: event.target.checked })
    }

    const handleSaveOptions = () => {
        let checkedList = ""
        for (let key in checkList) {
            if (checkList[key]) {
                checkedList += (key + ",")
            }
        }
        checkedList = checkedList.substring(0, checkedList.length-1)

        Axios.get('http://localhost:8080/GetProductByCategory', {
            headers: { 'Content-Type': 'application/json', 'email': props.match.params.email, 'category': checkedList }
        })
            .then(res => {
                setDataList(res.data.products);
                console.log('Response: ', res)
            })
            .catch(err => {
                console.log('Error: ', err)
            })
        setOpenOptions(false);
    }

    const handleAddToCart = () => {
        const cartData = {
            "email": email,
            "quantity": "1",
            ...openProductDetails
        }
        console.log("cartData", cartData);
        Axios.post("http://localhost:8080/AddToCart",
            cartData, { headers: {'Content-Type': 'application/json'}})
            .then((response) => {
                console.log(response);
                handleCloseProduct();
            })
            .catch((error) => console.log(error));
    }


    return(
        <div >
            <div >
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
                <AppBar position="static" >
                    <Tabs color="primary">
                        <Tab label="Change Business Options" onClick={handleClickOpenOptions}/>
                    </Tabs>
                </AppBar>
                <div align="center">
                    ~~WELCOME! SELECT <strong>CHANGE BUSINESS OPTIONS</strong> TO SHOW DIFFERENT PRODUCTS~~
                </div>
                <div className={classes.rootGrid} style={{width: 'auto', height: 'auto'}} >
                    <GridList spacing={4} className={classes.gridList} cols={ isSmUp ? 4 : 1}>
                        {dataList.map((tile, index) => (
                            <GridListTile key={index} >
                                <img src={tile.productImageUrl}
                                     alt={tile.productName}
                                     onClick={(event)=>handleClickOpenProduct(event, tile)}/>
                                <div className={classes.gridListTileCredit}>
                                    <Typography color="error" variant="h4">{"-$" + tile.productCredit}</Typography>
                                </div>
                                <GridListTileBar
                                    title={tile.productName}
                                    titlePosition="top"
                                    className={classes.titleBar}
                                />
                                <GridListTileBar
                                    height={4}
                                    title={"$" + tile.productPrice}
                                    subtitle={<p>By: {tile.supplierEmail} </p>}
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
                                <Card className={classes.root_product}>
                                    <CardHeader
                                        //this avatar serves no purpose
                                        avatar={
                                            <Avatar className={classes.avatar}>
                                                {openProductDetails.productName.charAt(0)}
                                            </Avatar>
                                        }
                                        title={openProductDetails.productName}
                                        subheader={<span>By: {openProductDetails.supplierEmail}</span>}
                                    />
                                    <CardMedia
                                        className={classes.media}
                                        title={openProductDetails.productName}
                                    />
                                    <CardContent>
                                        <img
                                            className='product-detail-img'
                                            src={openProductDetails.productImageUrl}
                                        />
                                        <Typography variant="body2" color="textSecondary" component="p"> Description: {openProductDetails.productDescription}</Typography>
                                        <Typography variant="body2" color="textSecondary" component="p">Remaining stock: {openProductDetails.productQuantity}</Typography>
                                        <Typography variant="body12" color="textSecondary" component="p">Price: ${openProductDetails.productPrice}</Typography>
                                        <Typography variant="body12" color="error" component="p">Credit: ${openProductDetails.productCredit}</Typography>
                                    </CardContent>
                                    <CardActions disableSpacing>
                                        <IconButton aria-label="add to favorites">
                                            <FavoriteIcon />
                                        </IconButton>
                                        <Button variant="outlined" onClick={handleAddToCart}>Add to Cart</Button>
                                        <br/>
                                    </CardActions>
                                </Card>

                            </div>
                            <div className={classes.root}>
                                <Button onClick={handleCloseProduct}
                                        variant="contained"
                                        color="primary"
                                >
                                    Close
                                </Button>
                                <br/>
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
                                        style={{width: image.width}}
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
                                                        checked={checkList.fastfood}
                                                        onChange={handleChangeOption}
                                                        value="fastfood"
                                                    />Fast Food
                                                </TableCell>
                                                <TableCell >
                                                    <Checkbox
                                                        checked={checkList.hairdressing}
                                                        onChange={handleChangeOption}
                                                        value="hairdressing"
                                                    />Hairdressing
                                                </TableCell>
                                                <TableCell >
                                                    <Checkbox
                                                        checked={checkList.clothing}
                                                        value="clothing"
                                                        onChange={handleChangeOption}
                                                    />Clothing
                                                </TableCell>
                                            </TableRow>
                                            <TableRow >
                                                <TableCell >
                                                    <Checkbox
                                                        checked={checkList.bakery}
                                                        value="bakery"
                                                        onChange={handleChangeOption}
                                                    />Bakery
                                                </TableCell>
                                                <TableCell >
                                                    <Checkbox
                                                        checked={checkList.makeup}
                                                        value="makeup"
                                                        onChange={handleChangeOption}
                                                    />Makeup
                                                </TableCell>
                                                <TableCell >
                                                    <Checkbox
                                                        checked={checkList.pharmacy}
                                                        value="pharmacy"
                                                        onChange={handleChangeOption}
                                                    />Pharmacy
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                            <div align="center">
                                <Button onClick={handleSaveOptions}
                                        variant="contained"
                                        color="primary"
                                        className={classes.saveOptionButton}
                                >Save Options
                                </Button>
                            </div>
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
                <br></br>
            </div>
        </div>

    );
}
