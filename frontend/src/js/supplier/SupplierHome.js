import React from 'react';
import Button from '@material-ui/core/Button';
import {fade, lighten, makeStyles} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ButtonBase from '@material-ui/core/ButtonBase';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import PropTypes from "prop-types";
import SearchIcon from '@material-ui/icons/Search';
import clsx from "clsx";
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import InputBase from "@material-ui/core/InputBase";
import AppBar from "@material-ui/core/AppBar";

function createData(did, purchaseDate, productName, quantity, buyer,  address, postCode, ) {
    return { did, purchaseDate, productName, quantity, buyer,  address, postCode, };
}
// Check how to organise by date
const rows = [
    createData(1, '20-May-2020', 'Rice 4KG Bag', 3, 'buyer',  '20 Washington Rd, Chinatown', 2133),
    createData(2, '7-Apr-2020', 'Flour 3KG Bag', 5, 'buyer',  '20 Washington Rd, Chinatown', 2134),
    createData(3, '7 Apr 2020', 'Cooking Pans',12, 'buyer', '20 Washington Rd, Chinatown', 2133),
    createData(4, '2 May 2020', 'Red Stools', 8, 'buyer', '20 Washington Rd, Chinatown', 2170),
    createData(5, '7 Mar 2020', 'Square Mirror 40cm x 40cm', 30 , 'buyer',  '20 Washington Rd, Chinatown', 2322),
    createData(6,'7/04/2020' , 'Rice 4KG Bag', 2, 'buyer', '20 Washington Rd, Chinatown', 2111),
    createData(7, '2/05/2020', 'Flour 2KG Bag', 7, 'buyer', '20 Washington Rd, Chinatown', 2000),
    createData(8, '7/04/2020', 'Cooking Pans',12, 'buyer', '20 Washington Rd, Chinatown', 2000),
    createData(9, '2/05/2020', 'Red Stools', 8, 'buyer', '20 Washington Rd, Chinatown', 2202),
    createData(10, '7/04/2020', 'Square Mirror 40cm x 40cm', 30 , 'buyer',  '20 Washington Rd, Chinatown', 2214),

];

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}
//////////// new for date - still doesn't work
function desc(a, b, orderBy) {
    console.log(a.purchaseDate)
    if (b.purchaseDate < a.purchaseDate) {
        console.log(b.purchaseDate)
        return -1;
    }
    if (b.purchaseDate > a.purchaseDate) {
        return 1;
    }
    return 0;
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) =>
        -desc(a, b, orderBy);
}
//////////////

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    { id: 'purchaseDate', date: true, disablePadding: false, label: 'Purchase Date' },
    { id: 'productName', numeric: false, disablePadding: false, label: 'Product Name' },
    { id: 'quantity', numeric: false, disablePadding: false, label: 'Quantity' },
    { id: 'buyer', numeric: false, disablePadding: false, label: 'Buyer' },
    { id: 'address', numeric: false, disablePadding: false, label: 'Address' },
    { id: 'postCode', numeric: false, disablePadding: true, label: 'Post Code' },

];


function EnhancedTableHead(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all products' }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
}));

const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const { numSelected } = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                    Products to be Delivered:
                </Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delivered">
                    <Button aria-label="Delivered" size="large" color="primary" variant="outlined">
                        <LocalShippingIcon />
                    </Button>

                </Tooltip>
            ) : (

                <Toolbar>
                </Toolbar>

            )}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};


const useStyles = makeStyles((theme) => ({
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
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.black, 0.15), //white
        '&:hover': {
            backgroundColor: fade(theme.palette.common.black, 0.25), //white
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



    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },

    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '100%',
        },
    },
    screenContent: {
        flexGrow: 1,
        padding: theme.spacing(1),
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

    icon: {
        color: "white",
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

// For deliveries table


export default function Home(){
    console.log("SUPPLIER HOME");

    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('purchaseDate');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.did);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, did) => {
        const selectedIndex = selected.indexOf(did);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, did);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (did) => selected.indexOf(did) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);



    const [openSave, setOpenSave] = React.useState(false);
    const [openOptions, setOpenOptions] = React.useState(false);

    const handleClickOpenOptions = () => {
        setOpenOptions(true);
    };
    const handleCloseOptions = () => {
        setOpenOptions(false);
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

    const handleChangeFastFood = (event) => {
        setCheckedff(event.target.checked);
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

    // For deliveries table


    // Page Content
    return(

        <div className={classes.screenContent}>
            <div >
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

                <AppBar position="static">
                    <Toolbar>
                        <Table >
                            <TableCell width="270">
                                <Button onClick={handleClickOpenOptions}
                                        variant="contained"
                                        color="#CACACB"
                                        size="small"
                                >Change Supplier Options
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button variant="contained" color="#CACACB" size="small" >
                                    Add New Product
                                </Button>
                            </TableCell>
                        </Table>

                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                                placeholder="Search…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </div>
                    </Toolbar>
                </AppBar>

                <Paper className={classes.paper}>
                    <EnhancedTableToolbar numSelected={selected.length} />
                    <TableContainer>
                        <Table
                            className={classes.table}

                            size={dense ? 'small' : 'medium'}
                            aria-label="enhanced table"
                        >
                            <EnhancedTableHead
                                classes={classes}
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={rows.length}
                            />
                            <TableBody>
                                {stableSort(rows, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        const isItemSelected = isSelected(row.did);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                onClick={(event) => handleClick(event, row.did)}
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.did}
                                                selected={isItemSelected}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={isItemSelected}
                                                        inputProps={{ 'aria-labelledby': labelId }}
                                                    />
                                                </TableCell>
                                                <TableCell align="left">{row.purchaseDate}</TableCell>
                                                <TableCell align="left" >{row.productName}</TableCell>
                                                <TableCell align="left">{row.quantity}</TableCell>
                                                <TableCell align="left">{row.buyer}</TableCell>
                                                <TableCell align="left">{row.address}</TableCell>
                                                <TableCell align="left">{row.postCode}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </Paper>
                <FormControlLabel
                    control={<Switch checked={dense} onChange={handleChangeDense} />}
                    label="Dense padding"
                />





                <Dialog open={openOptions} onClose={handleCloseOptions} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Change Supplier Options</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            What kind of businesses do you supply to?
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
            {'\n'}<br></br>
            <div>
            </div>

        </div>


    );
}
