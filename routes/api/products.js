const express = require('express')
const router = express.Router()
const _wc = require('../../config/wc')

// middleware
const auth = require('../../middleware/auth')

// route GET api/products
// @desc get all products
// @access public

router.get('/', async (req, res) => {
  try {
    const response = await _wc.get('products', {
      per_page: 40,
    })
    res.send(response.data)
    console.log(response.data.length)
  } catch (error) {
    console.log(error.response)
  }
})

// route GET api/products/categories
// @desc get a specific product by ID
// @access public

router.get('/categories', auth, async (req, res) => {
  try {
    const response = await _wc.get('products/categories')
    res.send(response.data)
    console.log(response)
  } catch (error) {
    console.log(error.response)
  }
})

// route GET api/products/single?id=****
// @desc get a specific product by ID
// @access public

router.get('/single?', auth, async (req, res) => {
  const { id } = req.query
  try {
    const response = await _wc.get(`products/${id}`)
    res.send(response.data)
  } catch (error) {
    if (error?.response?.data?.message === 'Invalid ID.') {
      res.json("error, product doesn't exist")
    }
  }
})

module.exports = router
