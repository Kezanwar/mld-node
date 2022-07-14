const express = require('express')
const router = express.Router()
const _wc = require('../../utilities/wc')
const _redis = require('../../utilities/redis')
const axios = require('axios')

// route GET api/products
// @desc get all products by traversing through each WC 'page' of products and building an array
// of them
// @access public

router.get('/wc-api/getProducts', async (req, res) => {
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
    res.status(200).send(allProducts)
  } catch (error) {
    console.log(error.response.data)
  }
})

// route GET api/getCategories
// @desc gets categories from WC and stores them in redis
// @access public

router.get('/wc-api/getCategories', async (req, res) => {
  try {
    const response = await _wc.get('products/categories', { per_page: 100 })
    await _redis.set('categories', JSON.stringify(response.data))
    res.status(200).send('success')
  } catch (error) {
    console.log(error.response)
  }
})

// route GET api/getTags
// @desc gets tags from WC and stores them in redis
// @access public

router.get('/wc-api/getTags', async (req, res) => {
  try {
    let allTags = []
    let breakLoop = false
    let page = 1

    while (!breakLoop) {
      console.log(page)
      const tags = await _wc
        .get('products/tags', { per_page: 100, page: page })
        .then((res) => res?.data)
        .catch((err) => console.log(err?.response?.data))
      if (tags.length === 0 || !tags) {
        breakLoop = true
      } else {
        allTags = allTags.concat(tags)
        page = page + 1
      }
    }
    await _redis.set('tags', JSON.stringify(allTags))
    res.status(200).send('success')
  } catch (error) {
    console.log(error.response)
  }
})

// route GET api/createProdsByCats
// @desc creates and stores a list of each category of products
// @access public

router.get('/redis/createProdsByCats', async (req, res) => {
  try {
    let products = await _redis.get('products')
    let categories = await _redis.get('categories')

    products = JSON.parse(products)
    categories = JSON.parse(categories)

    categories.forEach(async (category) => {
      const catAndProdObj = {
        title: category.name,
        id: category.id,
        description: category.description,
        products: products.filter((prod) =>
          prod.categories.some((prodCat) => prodCat.id === category.id)
        ),
      }
      await _redis.set(category.slug, JSON.stringify(catAndProdObj))
    })

    res.status(200).send('success')
  } catch (error) {
    console.log(error.response)
  }
})

// route GET api/single?id=****
// @desc get a specific product by ID from WC
// @access public

router.get('/single?', async (req, res) => {
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

// route GET /api/store-api/getProducts
// @desc gets all products from store-api rather than wc api
// @access public

router.get('/store-api/getProducts', async (req, res) => {
  try {
    let allProducts = []
    let breakLoop = false
    let page = 1

    while (!breakLoop) {
      console.log(page)
      const products = await axios
        .get(
          `${process.env.WC_URL}/wp-json/wc/store/v1/products?page=${page}&per_page=100`
        )
        .then((res) => res?.data)
        .catch((err) => console.error(err))
      if (products.length === 0 || !products) {
        breakLoop = true
      } else {
        allProducts = allProducts.concat(products)
        page = page + 1
      }
    }

    allProducts.forEach((prod) => {
      prod.short_description = sanitizeHtml(
        prod.short_description.replace(/(\r\n|\n|\r)/gm, ' '),
        {
          allowedTags: [],
        }
      )
      prod.description = sanitizeHtml(
        prod.description.replace(/(\r\n|\n|\r)/gm, ' '),
        { allowedTags: [] }
      )
    })

    await _redis.set('products', JSON.stringify(allProducts))

    res.send(allProducts)
  } catch (error) {
    res.json(error.response)
  }
})

module.exports = router
