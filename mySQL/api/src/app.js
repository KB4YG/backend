const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const compression = require('compression')
const app = express()
const router = express.Router()

router.use(compression())
router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

const sequelize = require('./lib/sequelize')

router.get('/', (req, res) => {
  res.json({"Hello": "From app.js"})
})

router.use('/location', require('./api/location'))

// router.get('/location', (req, res) => {
//   res.json(users)
// })

// router.post('/location', (req, res) => {
//   const user = {
//     id: ++userIdCounter,
//     name: req.body.name
//   }
//   users.push(user)
//   res.status(201).json(user)
// })

router.post('/parking-data', (req, res) => {
  res.cookie('Foo', 'bar')
  res.cookie('Fizz', 'buzz')
  res.json({})
})


// The serverless-express library creates a server and listens on a Unix
// Domain Socket for you, so you can remove the usual call to app.listen.
// app.listen(3000)
app.use('/', router)

app.use('*', function (req, res, next) {
  res.status(404).json({
    error: "Requested resource " + req.originalUrl + " does not exist"
  })
})

sequelize.sync()

// Export your express server so you can import it in the lambda function.
module.exports = app
