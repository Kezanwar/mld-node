const express = require('express')
require('dotenv').config()
const PORT = process.env.PORT

const app = express()

// init middleware
// allows us to get data within bodies of req/res
app.use(express.json({ extended: false }))

app.get('/', (req, res) => res.send('mld api running'))

// // define routes

app.use('/api/redis', require('./routes/api/redis-products'))

if (process.env.ENVIRONMENT === 'test') {
  app.use('/api/test', require('./routes/api/redis-tests'))
}

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
