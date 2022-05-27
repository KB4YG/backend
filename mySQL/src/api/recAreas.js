const express = require('express')
const router = express.Router()

const { Location } = require('../models/location')

const { requireAuthentication } = require('../lib/auth')

  // Returns list of parking lots for a given rec area
  router.get('/:recArea', async function (req, res) {
    const recArea = req.params.recArea
    const result = await Location.findAll({
        where: { recreationArea: recArea }
      })
  
    if (result) {
        res.status(200).send(result)
      } else {
        next()
      }
  })

  module.exports = router;