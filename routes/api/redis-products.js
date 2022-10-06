const express = require('express')
const router = express.Router()
const _redis = require('../../utilities/redis')
const axios = require('axios')
const _ = require('underscore')

// middleware
const auth = require('../../middleware/auth')
const { getRedisJSON } = require('../../utilities/getRedis')

// route GET api/redis/products/?<query_param_filters>
// @desc get the current products from the redis store
// @access public

router.get('/products', auth(), async (req, res) => {
  console.log(req.query)
  console.log(Object.values(req.query).flat())
  try {
    const products = await _redis.get('products')
    res.json(JSON.parse(products))
  } catch (error) {
    console.log(error.response)
  }
})

// route GET api/redis/single-product/recommended
// @desc get the current products from the redis store
// @access public

router.get('/single-product/recommended', auth(), async (req, res) => {
  const { product_category_id, store_id } = req.query
  console.log(req.query)
  if (!product_category_id || !store_id) {
    res.status(400).send({ error_message: 'Incorrect query params found' })
    return
  }
  try {
    const products = await getRedisJSON('products')
    const vendors = await getRedisJSON('vendors')
    const thisVendor = vendors.find((v) => v.id === parseInt(store_id))
    const recommendedProds = _.shuffle(products).filter((p) =>
      p.categories.some((c) => c.id === parseInt(product_category_id))
    )
    const respsonse = {
      recommended_products: recommendedProds.slice(0, 6),
      store_products: thisVendor.products.slice(0, 6),
    }
    res.json(respsonse)
    return
  } catch (error) {
    console.log(error)
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
    if (prodsByCat) res.status(200).send(JSON.parse(prodsByCat))
    if (!prodsByCat) res.status(400).send({ error_message: 'No products found' })
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

// route GET api/redis/getVendors
// @desc gets all stores from Dokan
// @access public

router.get('/vendors', async (req, res) => {
  try {
    const vendors = await _redis.get('vendors')
    res.status(200).send(JSON.parse(vendors))
  } catch (error) {
    console.log(error)
  }
})

// route GET api/redis/getVendorByid
// @desc gets all stores from Dokan
// @access public

router.get('/getVendorById/:id', async (req, res) => {
  try {
    let vendors = await _redis.get('vendors')
    const id = req.params.id
    vendors = JSON.parse(vendors)
    const vendor = vendors.find((v) => parseInt(id) === v.id)
    res.status(200).send(vendor)
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
