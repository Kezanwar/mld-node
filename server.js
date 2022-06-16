const express = require('express')
require('dotenv').config()
const PORT = process.env.PORT

const app = express()

// init middleware
// allows us to get data within bodies of req/res
app.use(express.json({ extended: false }))

app.get('/', (req, res) => res.send('mld api running'))

// // define routes

app.use('/api/products', require('./routes/api/products'))

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
