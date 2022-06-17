const express = require('express')
const router = express.Router()
const _wc = require('../../config/wc')
const _redis = require('../../config/redis')
// const redis = require('redis')

// const redisClient = redis.createClient(process.env.REDIS_PORT)
// redisClient.connect()

// middleware
const auth = require('../../middleware/auth')

// route GET api/products
// @desc get all products by traversing through each WC 'page' of products and building an array
// of them
// @access public

router.get('/', async (req, res) => {
  try {
    let allProducts = []
    let breakLoop = false
    let page = 1
    while (!breakLoop) {
      console.log(page)
      const products = await _wc
        .get('products', { per_page: 100, page: page })
        .then((res) => res?.data)
        .catch((err) => console.log(err?.response?.data))
      if (products.length === 0 || !products) {
        breakLoop = true
      } else {
        allProducts = allProducts.concat(products)
        page = page + 1
      }
    }

    // const response = await _wc.get('products', {
    //   per_page: 40,
    // })
    await _redis.set('products', JSON.stringify(allProducts))
    res.send('success')
    // console.log(response.data.length)
  } catch (error) {
    console.log(error.response.data)
  }
})

// route GET api/products/redis
// @desc get the products from the redis store
// @access public

router.get('/redis', async (req, res) => {
  try {
    const products = await _redis.get('products')
    res.json(products)
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
