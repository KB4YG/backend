const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const compression = require('compression')
const app = express()

const api = require('./api')
const sequelize = require('./lib/sequelize')

app.use(compression())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', api)

app.use('*', function (req, res, next) {
  res.status(404).json({
    error: "Requested resource " + req.originalUrl + " does not exist"
  })
})

app.use('*', function (err, req, res, next) {
  console.error("== Error:", error)
  res.status(500).send({
    error: "Server error. Please try again later."
  })
})

sequelize.sync()

module.exports = app
