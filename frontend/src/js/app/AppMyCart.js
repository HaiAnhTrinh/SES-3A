import React, { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import Axios from 'axios'
import TextField from '@material-ui/core/TextField'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import MenuItem from '@material-ui/core/MenuItem'
import { months, years, Countrys } from '../constants/constants'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContentText from '@material-ui/core/DialogContentText'
import '../../css/AppMyCart.css'

export default function MyCart(props) {
  const [email] = useState(props.match.params.email)
  const [total, setTotal] = useState(0)
  const [values, setValues] = React.useState({
    cardAccept: '',
    cardNumber: 0,
    expiryMonth: '',
    expiryYear: '',
    cvv: 0,
    name: '',
    country: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    contactPhoneNumber: '',
    emailAddress: ''
  })
  const [isShowPayment, setIsShowPayment] = useState(false)
  const [rows, setRows] = useState([])
  const [paymentTip, setPaymentTip] = useState('')
  const [isShowPaymentDialog, setIsShowPaymentDialog] = useState(false)

  useEffect(() => {
    ;(() => {
      Axios.get('http://localhost:8080/GetCart', {
        headers: { 'Content-Type': 'application/json', email: email }
      })
          .then(response => {
            console.log(response)
            const { cartProducts } = response.data
            cartProducts.map((c, index) => {
              c.id = index
            })
            let totalCost = 0
            cartProducts.map(item => (totalCost += parseFloat(item.cost)))
            setRows(cartProducts)
            setTotal(totalCost)
          })
          .catch(err => console.log('Error: ', err))
    })()
  }, [])

  const handleChange = prop => e => {
    const { value } = e.target
    setValues({ ...values, [prop]: value })
  }

  const handleSubmit = () => {
    console.log('values',values)
    Axios.post(
        'http://localhost:8080/Purchase',
        { email, cartProducts: rows },
        {
          headers: { 'Content-Type': 'application/json' }
        }
    )
        .then(response => console.log(response))
        .catch(error => console.log(error))
    if (
        values.cardAccept &&
        values.cardNumber.length === 16 &&
        values.expiryMonth &&
        values.expiryYear &&
        values.country &&
        values.cvv.length === 3 &&
        values.name &&
        values.address1 &&
        values.address2 &&
        values.city &&
        values.state &&
        values.postalCode &&
        values.contactPhoneNumber &&
        values.emailAddress &&
        values.emailAddress.includes('@') &&
        values.emailAddress.includes('.')
    ) {
      setPaymentTip('Payment Received. Thank You fvpor Payment')
    } else {
      setPaymentTip('Some Information is Missing or Incorrect')
    }
    setIsShowPaymentDialog(true)
  }

  const handleTableInputChange = (e, product) => {
    const { value } = e.target
    let totalCost = 0
    const newRows = [...rows]
    newRows.forEach(r => {
      if (r.id === product.id) {
        r.quantity = value
        r.cost = value * r.price
      }
    })
    newRows.map(r => (totalCost += parseFloat(r.cost)))
    setRows(newRows)
    setTotal(totalCost)
  }

  const handleDelete = record => {
    const params = {
      email,
      productName: record.name,
      supplierEmail: record.supplier
    }
    Axios.post('http://localhost:8080/RemoveFromCart', params, {
      headers: { 'Content-Type': 'application/json' }
    })
        .then(() => {
          window.location.reload()
        })
        .catch(err => {
          console.log('Error: ', err)
        })
  }

  return (
    <div className='my-cart-container'>
      <div className='page-title'>Cart</div>
      <div className='table-container'>
        <TableContainer component={Paper}>
          <Table aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell>Remove</TableCell>
                <TableCell>Item</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Cost</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.id}>
                  <TableCell component='th'>
                    <DeleteOutlinedIcon onClick={() => handleDelete(row)} />
                  </TableCell>
                  <TableCell component='th'>{row.name}</TableCell>
                  <TableCell component='th'>{row.price}</TableCell>
                  <TableCell component='th'>{row.supplier}</TableCell>
                  <TableCell component='th'>
                    <TextField
                        onChange={e => handleTableInputChange(e, row)}
                        size='small'
                        type='number'
                        inputProps={{
                          min: 1
                        }}
                        defaultValue={row.quantity}
                    />
                  </TableCell>
                  <TableCell component='th'>
                    <TextField
                        InputProps={{
                          readOnly: true
                        }}
                        size='small'
                        type='number'
                        value={row.cost}
                    />
                  </TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell align='right' colSpan={5}>
                  Total
                </TableCell>
                <TableCell align='left'>{total}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className='record-to-payment'>
        {!isShowPayment ? (
          <Button onClick={() => setIsShowPayment(true)} variant='contained' color='primary'>
            Record To PAYMENT
          </Button>
        ) : null}
      </div>
      {isShowPayment ? (
        <div className='form-wrapper'>
          <div className='payment-information'>Payment Information</div>
          <div className='title-tip'>
            Please enter your credit card information below and click Submit
          </div>
          <div className='form-item'>
            <div className='credit-label'>Credit Cards Accepted</div>
            <RadioGroup row onChange={handleChange('cardAccept')}>
              <FormControlLabel value='visa' control={<Radio color='primary' />} label='Visa' />
              <FormControlLabel
                value='masterCard'
                control={<Radio color='primary' />}
                label='MasterCard'
              />
              <FormControlLabel value='payPal' control={<Radio color='primary' />} label='PayPal' />
            </RadioGroup>
          </div>
          <div className='form-item'>
            <div className='label'>Card Number</div>
            <TextField
              onChange={handleChange('cardNumber')}
              size='small'
              type='number'
              variant='outlined'
              className='input-full'
            />
          </div>
          <div className='form-item'>
            <div className='label'>Expiry Date(MM)</div>
            <TextField
              select
              size='small'
              variant='outlined'
              value={values.expiryMonth}
              onChange={handleChange('expiryMonth')}
            >
              {months.map(month => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              size='small'
              variant='outlined'
              className='input-item'
              value={values.expiryYear}
              onChange={handleChange('expiryYear')}
            >
              {years.map(year => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className='form-item'>
            <div className='label'>CVV</div>
            <TextField
              onChange={handleChange('cvv')}
              size='small'
              type='number'
              variant='outlined'
              className='input-full'
            />
          </div>
          <div className='form-item'>
            <div className='label'>Name On Cart</div>
            <TextField
              onChange={handleChange('name')}
              size='small'
              variant='outlined'
              className='input-full'
            />
          </div>
          <div className='form-item'>
            <div className='label'>Country</div>
            <TextField
              onChange={handleChange('country')}
              select
              size='small'
              variant='outlined'
              value={values.country}
              className='input-full'
            >
              {Countrys.map(country => (
                <MenuItem key={country} value={country}>
                  {country}
                </MenuItem>
              ))}
            </TextField>
          </div>

          <div className='form-item'>
            <div className='label'>Address1</div>
            <TextField
              onChange={handleChange('address1')}
              size='small'
              variant='outlined'
              className='input-full'
            />
          </div>
          <div className='form-item'>
            <div className='label'>Address2</div>
            <TextField
              onChange={handleChange('address2')}
              size='small'
              variant='outlined'
              className='input-full'
            />
          </div>

          <div className='form-item'>
            <div className='label'>City</div>
            <TextField
              onChange={handleChange('city')}
              size='small'
              variant='outlined'
              className='input-full'
            />
          </div>

          <div className='form-item'>
            <div className='label'>State</div>
            <TextField
              onChange={handleChange('state')}
              size='small'
              variant='outlined'
              className='input-full'
            />
          </div>

          <div className='form-item'>
            <div className='label'>Postal Code</div>
            <TextField
              onChange={handleChange('postalCode')}
              size='small'
              variant='outlined'
              type='number'
              className='input-full'
            />
          </div>

          <div className='form-item'>
            <div className='label'>Contact Phone Number</div>
            <TextField
              onChange={handleChange('contactPhoneNumber')}
              size='small'
              variant='outlined'
              type='number'
              className='input-full'
            />
          </div>

          <div className='form-item'>
            <div className='label'>Email Address</div>
            <TextField
              onChange={handleChange('emailAddress')}
              size='small'
              variant='outlined'
              className='input-full'
            />
          </div>

          <div className='form-item submit'>
            <Button onClick={handleSubmit} variant='contained' color='primary' fullWidth>
              SUBMIT
            </Button>
          </div>
        </div>
      ) : null}

      <Dialog open={isShowPaymentDialog} onClose={() => setIsShowPaymentDialog(false)}>
        <DialogTitle id='alert-dialog-title'>{'Alert'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>{paymentTip}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
              variant='contained'
              size='large'
              onClick={() => setIsShowPaymentDialog(false)}
              color='primary'
              autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
