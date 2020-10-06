import React, { useState, useEffect } from 'react'
import * as firebase from 'firebase'
import Button from '@material-ui/core/Button'
import Axios from 'axios'
import Dialog from '@material-ui/core/Dialog'
import TextField from '@material-ui/core/TextField'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import FavoriteIcon from '@material-ui/icons/Favorite'
import SearchIcon from '@material-ui/icons/Search'
import '../../css/VendorHome.css'

export default function Home(props) {
  const [visibleOptionModal, setVisibleOptionModal] = useState(false)
  const [optionImgList] = useState([
    {
      id: 1,
      url: 'https://cdn.pixabay.com/photo/2015/12/08/00/26/food-1081707_960_720.jpg',
      text: 'Food'
    },
    {
      id: 2,
      url: 'https://cdn.pixabay.com/photo/2015/12/08/00/26/food-1081707_960_720.jpg',
      text: 'Service'
    },
    {
      id: 3,
      url: 'https://cdn.pixabay.com/photo/2015/12/08/00/26/food-1081707_960_720.jpg',
      text: 'Retail'
    }
  ])
  const [isShowSearchInput, setIsShowSearchInput] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [checkList, setCheckList] = React.useState({
    fastfood: false,
    hairdressing: false,
    clothingShoes: false,
    bakery: false,
    makeup: false,
    pharmacy: false
  })

  const [list, setList] = useState([])
  const [productDetail, setProductDetail] = useState({})
  const [isShowList, setIsShowList] = useState(false)
  const [productDetailModalVisible, setProductDetailModalVisible] = useState(false)
  const [isShowTip, setIsShowTip] = useState(false)

  const handleShowSearch = e => {
    e.stopPropagation()
    setIsShowSearchInput(true)
  }

  const handleSearchInputChange = e => {
    setSearchValue(e.target.value)
  }

  const handleSearch = () => {
    console.log(searchValue)
    setIsShowSearchInput(false)
  }

  const handleShowOptionModal = () => {
    setVisibleOptionModal(true)
  }

  const handleCloseOptionModal = () => {
    setVisibleOptionModal(false)
  }

  const handleChange = event => {
    setCheckList({ ...checkList, [event.target.name]: event.target.checked })
  }

  const descriptionElementRef = React.useRef(null)
  useEffect(() => {
    if (visibleOptionModal) {
      const { current: descriptionElement } = descriptionElementRef
      if (descriptionElement !== null) {
        descriptionElement.focus()
      }
    }
  }, [visibleOptionModal])

  const handleQuery = () => {
    let category = ''
    for (const key in checkList) {
      if (checkList[key]) {
        category = key
      }
    }
    Axios.get('http://localhost:8080/GetProductByCategory', {
      headers: { 'Content-Type': 'application/json', email: props.match.params.email, category }
    })
      .then(res => {
        const products = res.data.products
        setList(products)
        console.log('Response: ', res)
      })
      .catch(err => {
        console.log('Error: ', err)
      })
  }

  const handleSaveOptions = () => {
    handleCloseOptionModal()
    const checkedList = []
    for (const key in checkList) {
      if (checkList[key]) checkedList.push(key)
    }
    console.log(checkedList)
    setIsShowList(true)
    handleQuery()
    // TODO: request
  }

  const handleShowDetail = product => {
    setProductDetailModalVisible(true)
    setProductDetail(product)
  }

  const handleCloseProductDetailModal = () => {
    setProductDetailModalVisible(false)
  }

  const handleAddToCart = () => {
    const cartData = {
      email: props.match.params.email,
      quantity: '1',
      ...productDetail
    }
    console.log('cartData', cartData)
    Axios.post('http://localhost:8080/AddToCart', cartData, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        console.log(response)
        setIsShowTip(true)
        handleCloseProductDetailModal()
      })
      .catch(error => console.log(error))
  }

  return (
    <div className='container'>
      <div onClick={handleShowOptionModal} className='business-option'>
        <span>CHANGE BUSINESS OPTIONS</span>
        <SearchIcon className='search' onClick={handleShowSearch} />
      </div>

      {isShowList ? (
        <div className='list-wrapper'>
          <ul className='list'>
            {list.map((l, index) => (
              <li onClick={() => handleShowDetail(l)} className='li' key={index}>
                <div className='title'>{l.productName}</div>
                <img src={l.productImageUrl} className='img' />
                <div className='desc'>
                  <div className='left'>
                    <div className='price'>{l.productPrice}</div>
                    <div className='by'>By：{l.supplierEmail}</div>
                  </div>
                  <div className='right'>
                    <div className='favorites'>
                      <FavoriteIcon />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Dialog open={isShowSearchInput} onClose={() => setIsShowSearchInput(false)}>
        <DialogTitle>Search</DialogTitle>
        <DialogContent className='search-dialog'>
          <TextField
            autoFocus
            className='search-input'
            label='KeyWord'
            type='email'
            fullWidth
            onChange={handleSearchInputChange}
          />
          <Button
            onClick={handleSearch}
            fullWidth
            variant='contained'
            size='small'
            color='primary'
            className='ok-btn'
          >
            Ok
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isShowTip} onClose={() => setIsShowTip(false)}>
        <DialogContent style={{marginBottom:'10px'}}>Added successfully</DialogContent>
      </Dialog>


      <Dialog
        open={visibleOptionModal}
        onClose={handleCloseOptionModal}
        scroll='paper'
        aria-labelledby='scroll-dialog-title'
        aria-describedby='scroll-dialog-description'
      >
        <DialogTitle id='scroll-dialog-title'>Change Business Options</DialogTitle>
        <DialogContent>
          <div>
            <div className='title-desc'>What kind of business do you run/ plan to run?</div>
            <div className='img-container'>
              {optionImgList.map(p => (
                <div className='img-wrapper' key={p.id}>
                  <img src={p.url} className='img' />
                  <div className='text'>
                    <div>{p.text}</div>
                    <div className='remove'></div>
                  </div>
                  <div className='mask'></div>
                </div>
              ))}
            </div>
            <div className='choose-option-container'>
              <div className='option-title'>
                <span className='option-title-item'>Choose Food options</span>
                <span className='option-title-item'>Choose Serviece options</span>
                <span className='option-title-item'>Choose Retail options</span>
              </div>
              <div className='options'>
                <FormGroup row className='option-item'>
                  <FormControlLabel
                    className='fom-item'
                    control={
                      <Checkbox
                        size='small'
                        checked={checkList.fastfood}
                        onChange={handleChange}
                        name='fastfood'
                      />
                    }
                    label='Fast Food'
                  />
                  <FormControlLabel
                    className='fom-item'
                    control={
                      <Checkbox
                        size='small'
                        checked={checkList.hairdressing}
                        onChange={handleChange}
                        name='hairdressing'
                      />
                    }
                    label='Hairdressing'
                  />
                  <FormControlLabel
                    className='fom-item'
                    control={
                      <Checkbox
                        size='small'
                        checked={checkList.clothingShoes}
                        onChange={handleChange}
                        name='clothingShoes'
                      />
                    }
                    label='ClothingShoes'
                  />
                  <FormControlLabel
                    className='fom-item'
                    control={
                      <Checkbox
                        size='small'
                        checked={checkList.bakery}
                        onChange={handleChange}
                        name='bakery'
                      />
                    }
                    label='Bakery'
                  />
                  <FormControlLabel
                    className='fom-item'
                    control={
                      <Checkbox
                        size='small'
                        checked={checkList.makeup}
                        onChange={handleChange}
                        name='makeup'
                      />
                    }
                    label='Makeup'
                  />
                  <FormControlLabel
                    className='fom-item'
                    control={
                      <Checkbox
                        size='small'
                        checked={checkList.pharmacy}
                        onChange={handleChange}
                        name='pharmacy'
                      />
                    }
                    label='Pharmacy'
                  />
                </FormGroup>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveOptions} color='primary' variant='contained'>
            SAVE OPTIONS
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={productDetailModalVisible}
        onClose={handleCloseProductDetailModal}
        scroll='paper'
        className='product-detail-dialog'
      >
        <DialogTitle>Product Details</DialogTitle>
        <DialogContent className='dialog-content'>
          <Card className='product-detail-wrapper'>
            <CardHeader
              avatar={
                <Avatar aria-label='recipe' className='product-img'>
                  R
                </Avatar>
              }
              title='Some thing'
              subheader={`By: ${productDetail.supplierEmail}`}
            />
            <CardMedia className='media' image={productDetail.productImageUrl} />
            <CardContent>
              <img
                className='product-detail-img'
                src={productDetail.productImageUrl}
              />
              <div>{productDetail.productDescription}</div>
              <div>Remaining stock: {productDetail.productQuantity}</div>
              <div>Price: ${productDetail.productPrice}</div>
            </CardContent>
            <CardActions disableSpacing>
              <IconButton aria-label='add to favorites'>
                <FavoriteIcon />
              </IconButton>
              <Button onClick={handleAddToCart} variant='outlined'>
                ADD TO CART
              </Button>
            </CardActions>
          </Card>
          <Button
            onClick={() => setProductDetailModalVisible(false)}
            size='small'
            fullWidth
            color='primary'
            variant='contained'
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
