import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import Button from "@material-ui/core/Button";
import { Dehaze, YoutubeSearchedFor } from "@material-ui/icons";
import "./Cards.css";
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(Remove, Item, Price, Supplie, Quantity, Cost) {
  return { Remove, Item, Price, Supplie, Quantity, Cost };
}

const rows = [
  createData("Frozen", 159, 6.0, 24, 4.0, 1),
  createData("Ice cr", 237, 9.0, 37, 4.3, 1),
  createData("Eclair", 262, 16.0, 24, 6.0, 21),
  createData("Cupcake", 305, 3.7, 67, 4.3, 324),
  createData("Ginger", 356, 16.0, 49, 3.9, 39),
];

export default function SimpleTable() {
  const classes = useStyles();
  return (
    <div>
      <div className="header">
        <Button color="primary">
          <Dehaze></Dehaze>
        </Button>
        <Button color="primary">Cards</Button>
        <Button color="primary">
          <YoutubeSearchedFor></YoutubeSearchedFor>
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Remove</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Supplie</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Cost</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.Remove}>
                <TableCell component="th" scope="row">
                  {row.Remove}
                </TableCell>
                <TableCell>{row.Item}</TableCell>
                <TableCell>{row.Price}</TableCell>
                <TableCell>{row.Supplie}</TableCell>
                <TableCell>{row.Quantity}</TableCell>
                <TableCell>{row.Cost}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TablePagination
              rowsPerPageOptions={[10, 50, { value: -1, label: "All" }]}
            />
          </TableFooter>
        </Table>
      </TableContainer>
      <div className="btn">
        <Button
          variant="contained"
          color="primary"
          size="large"
          className={classes.margin}
        >
          PROCEED TO PAYMENT
        </Button>
      </div>
    </div>
  );
}
