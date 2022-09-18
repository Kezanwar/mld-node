const express = require('express')
const router = express.Router()
const _wp = require('../../utilities/wp')
const axios = require('axios')

// middleware
const auth = require('../../middleware/auth')

router.get('/users', auth(), async (req, res) => {
  try {
    const users = await axios.get(`${_wp.URL}/wp-json/wp/v2/users`, {
      headers: _wp.HEADERS,
    })
    res.send(users.data)
  } catch (error) {
    console.log(error)
    res.send('error')
  }
})

router.post('/new-user', auth(), async (req, res) => {
  console.log(req)
  const { first_name, last_name, email, password } = req.body
  try {
    // const users = await axios.post(
    //   `${_wp.URL}/wp-json/wp/v2/users`,
    //   { headers: _wp.POST_HEADERS },
    //   {
    //     first_name,
    //     last_name,
    //     email,
    //     password,
    //   }
    // )
    const newUserReq = await axios({
      method: 'post',
      url: `${_wp.URL}/wp-json/wp/v2/users`,
      headers: _wp.POST_HEADERS,
      data: {
        first_name: first_name,
        last_name,
        email,
        password,
      },
    })
    res.send(newUserReq.data)
  } catch (error) {
    console.log(error)
    res.send(error)
  }
})

const stackoverflowinfo =
  'https://stackoverflow.com/questions/31364971/endpoint-for-user-login-signup-in-woocommerce-rest-api-v2'

module.exports = router
