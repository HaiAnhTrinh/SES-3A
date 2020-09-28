import React, { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
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
import '../../css/AppMyCart.css'

export default function MyCart() {
  const [values, setValues] = React.useState({
    cardAccept: '',
    cardNumber: 0,
    expiryMonth: '',
    expiryYear: '',
    cvv: 0,
    country: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    contactPhoneNumber: ''
  })
  const [isShowPayment, setIsShowPayment] = useState(false)
  const [rows, setRows] = useState([
    {
      id: 1,
      item: 'test',
      price: 11,
      supplier: 'test@gmail.com',
      quantity: 6,
      cost: 66
    }
  ])

  const handleChange = prop => e => {
    const { value } = e.target
    setValues({ ...values, [prop]: value })
  }

  const handleSubmit = () => {
    // TODO: request
    console.log('submit', values)
  }

  const handleTableInputChange = (prop, key) => e => {
    const { value } = e.target
    console.log(value)
    const realRows = [...rows]
    realRows.forEach(r => {
      if (r.id === prop.id) {
        r[key] = value
      }
    })

    setRows(realRows)
  }

  const handleDelete = record => {
    setRows(rows.filter(row => row.id !== record.id))
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
                  <TableCell component='th'>{row.item}</TableCell>
                  <TableCell component='th'>{row.price}</TableCell>
                  <TableCell component='th'>{row.supplier}</TableCell>
                  <TableCell component='th'>
                    <TextField
                      onChange={handleTableInputChange(row, 'quantity')}
                      size='small'
                      type='number'
                      value={row.quantity}
                    />
                  </TableCell>
                  <TableCell component='th'>
                    <TextField
                      onChange={handleTableInputChange(row, 'cost')}
                      size='small'
                      type='number'
                      value={parseInt(row.quantity) * parseInt(row.price)}
                    />
                  </TableCell>
                </TableRow>
              ))}

              {rows.map(row => (
                <TableRow key={row.id}>
                  <TableCell colSpan={6} component='th'>
                    total:
                    {!isNaN(parseInt(row.quantity) * parseInt(row.price))
                      ? parseInt(row.quantity) * parseInt(row.price)
                      : null}
                  </TableCell>
                </TableRow>
              ))}
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
    </div>
  )
}
