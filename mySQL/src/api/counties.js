const express = require('express')
const router = express.Router()
const { Sequelize } = require('sequelize');

const { Location } = require('../models/location')

// Returns list of DISTINCT counties and their URLs
router.get('/', async function (req, res) {
    const result = await Location.findAll({
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('county')), 'county'], 'countyUrl'] ,
      })
  
    if (result) {
        res.status(200).send(result)
      } else {
        next()
      }
  })

  // Returns list of rec Areas for a given county
  router.get('/:county', async function (req, res) {
    const county = "/" + req.params.county
    const result = await Location.findAll({
        where: { countyURL: county }
      })
  
    if (result) {
        res.status(200).send(result)
      } else {
        next()
      }
  })

  module.exports = router;