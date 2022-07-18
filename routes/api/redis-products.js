const express = require('express')
const router = express.Router()
const _redis = require('../../utilities/redis')
const axios = require('axios')

// middleware
const auth = require('../../middleware/auth')

// route GET api/redis/products
// @desc get the current products from the redis store
// @access public

router.get('/products', auth(), async (req, res) => {
  try {
    const products = await _redis.get('products')
    res.json(JSON.parse(products))
  } catch (error) {
    console.log(error.response)
  }
})

// route GET api/redis/categories
// @desc get the current categories from the redis store
// @access public

router.get('/categories', auth(), async (req, res) => {
  try {
    const categories = await _redis.get('categories')
    res.json(JSON.parse(categories))
  } catch (error) {
    console.log(error.response)
  }
})

// route GET api/redis/categories
// @desc get the current tags from the redis store
// @access public

router.get('/tags', auth(), async (req, res) => {
  try {
    const tags = await _redis.get('tags')
    res.json(JSON.parse(tags))
  } catch (error) {
    console.log(error.response)
  }
})

// route GET api/redis/getProdsByCat/:cat
// @desc gets categories from WC and stores them in redis
// @access public

router.get('/getProdsByCat/:cat', auth(), async (req, res) => {
  console.log(req.params)
  try {
    const cat = req.params.cat
    const prodsByCat = await _redis.get(cat)
    res.status(200).send(prodsByCat ? JSON.parse(prodsByCat) : 'null')
  } catch (error) {
    console.log(error.response)
  }
})

// route GET api/redis/single?id=****
// @desc get a specific product by ID from Redis Cache
// @access public

router.get('/single?', auth(), async (req, res) => {
  const { id } = req.query
  try {
    let products = await _redis.get(`products`)
    products = JSON.parse(products)
    const prod = products.find((prod) => prod.id == id)
    res.status(200).send(prod)
  } catch (error) {
    if (error?.response?.data?.message === 'Invalid ID.') {
      res.json("error, product doesn't exist")
    }
  }
})

// route GET api/redis/single?id=****
// @desc get a specific product by ID from Redis Cache
// @access public

router.get('/price/single?', auth(), async (req, res) => {
  const { id } = req.query
  try {
    let products = await _redis.get(`products`)
    products = JSON.parse(products)
    const prod = products.find((prod) => prod.id == id)
    const regexp = /[\d\.]+/
    const priceHTMLArr = prod.price_html.split('>')
    let priceArr = []
    priceHTMLArr.forEach((s) => priceArr.push(s.match(regexp)))
    res.status(200).send(priceArr.filter((el) => el !== null))
  } catch (error) {
    if (error?.response?.data?.message === 'Invalid ID.') {
      res.json("error, product doesn't exist")
    }
  }
})

module.exports = router
