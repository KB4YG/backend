const express = require('express')
const router = express.Router()

const { ValidationError } = require('sequelize')
const { Location, LocationClientFields } = require('../models/location')

const { ParkingData } = require('../models/parkingData')
const { Image } = require('../models/image')

const { requireAuthentication } = require('../lib/auth')


router.get('/', async function (req, res) {
  let page = parseInt(req.query.page) || 1
  page = page < 1 ? 1 : page
  const numPerPage = 10
  const offset = (page - 1) * numPerPage

  let filter = {}
  if (req.query.recreationArea) filter.recreationArea = req.query.recreationArea
  if (req.query.county) filter.county = req.query.county

  const result = await Location.findAndCountAll({
    limit: numPerPage,
    offset: offset,
    where: filter
  })

  /*
    * Generate HATEOAS links for surrounding pages.
    */
  const lastPage = Math.ceil(result.count / numPerPage)
  const links = {}
  if (page < lastPage) {
    links.nextPage = `/location?page=${page + 1}`
    links.lastPage = `/location?page=${lastPage}`
  }
  if (page > 1) {
    links.prevPage = `/location?page=${page - 1}`
    links.firstPage = '/location?page=1'
  }

  /*
    * Construct and send response.
    */
  res.status(200).json({
    locations: result.rows,
    pageNumber: page,
    totalPages: lastPage,
    pageSize: numPerPage,
    totalCount: result.count,
    links: links
  })
})

router.get('/:locationId', async function (req, res, next) {
  const locationId = parseInt(req.params.locationId)
  const parkingData = await ParkingData.findOne()
  const location = await Location.findByPk(locationId, {
    include: [ Image ]
  })
  if (location) {
    location.parkingData = parkingData
    res.status(200).send(location)
  } else {
    next()
  }
})

router.post('/', requireAuthentication, async function (req, res) {
  try {
    const location = await Location.create(req.body, LocationClientFields)
    res.status(201).send({ id: location.id })
  } catch (e) {
    if (e instanceof ValidationError) {
      res.status(400).send({ error: e.message })
    } else {
      throw e
    }
  }
})

router.patch('/:locationId', requireAuthentication, async function (req, res, next) {
  const locationId = req.params.locationId
  const result = await Location.update(req.body, {
    where: { id: locationId },
    fields: LocationClientFields
  })
  if (result[0] > 0) {
    res.status(204).send()
  } else {
    next()
  }
})
  
/*
  * Route to delete a business.
  */
router.delete('/:locationId', requireAuthentication, async function (req, res, next) {
  const locationId = req.params.locationId
  const result = await Location.destroy({ where: { id: locationId }})
  if (result > 0) {
    res.status(204).send()
  } else {
    next()
  }
})

module.exports = router;