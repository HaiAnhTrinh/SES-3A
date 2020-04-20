import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

const columns = [
    { id: 'product', label: 'Product', minWidth: 170 },
    {
        id: 'amount',
        label: 'Amount',
        minWidth: 170,
        align: 'left',
        format: (value) => value.toLocaleString(),
    },
    {
        id: 'value',
        label: 'Total Value',
        minWidth: 170,
        align: 'left',
        format: (value) => value.toLocaleString(),
    },
    {
        id: 'dop',
        label: 'Date of Purchase',
        minWidth: 170,
        align: 'left',
        format: (value) => value.toFixed(2),
    },
];

function createData(product, amount, dop) {
    const value = amount * 6;
    return { product, amount, value, dop };
}

const rows = [
    createData('Rice', '2', 1324171354, 3287263),
    createData('Old Rice', '2', 1403500365, 9596961),
    createData('New Rice', '2', 60483973, 301340),
    createData('Cooked Rice', '55', 327167434, 9833520),
    createData('Fried Rice', '4', 37602103, 9984670),
    createData('Broken Rice', '69', 25475400, 7692024),
    createData('Expensive Rice', '69', 83019200, 357578),
    createData('Sticky Rice', '69', 4857000, 70273),
    createData('Other Rice', '69', 126577691, 1972550),
    createData('Another Rice', '69', 126317000, 377973),
    createData('Some other Rice', '365', 67022000, 640679),
    createData('Good Rice', '542', 67545757, 242495),
    createData('Better Rice', '420', 146793744, 17098246),
    createData('Best Rice', '420', 200962417, 923768),
    createData('Worst Rice', '420', 210147125, 8515767),
];

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
});

export default function StickyHeadTable() {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper className={classes.root}>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.format && typeof value === 'number' ? column.format(value) : value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>
    );
}