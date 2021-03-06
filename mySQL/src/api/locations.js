const express = require('express')
const router = express.Router()

const { ValidationError } = require('sequelize')
const { Location, LocationClientFields } = require('../models/location')

const { getLatestData } = require('../models/parkingData')
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
  const parkingData = await getLatestData(locationId)
  const location = await Location.findByPk(locationId, {
    include: [ Image, { model: ParkingData, limit: 1, order: [[ 'dateTime', 'DESC' ]] } ]
  })
  if (location) {
    if(parkingData)
      location.setDataValue('parkingData', parkingData);
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


router.get('/:locationId/data', async function (req, res) {
  const locationId = parseInt(req.params.locationId)
  let page = parseInt(req.query.page) || 1
  page = page < 1 ? 1 : page
  const numPerPage = 10
  const offset = (page - 1) * numPerPage

  const result = await ParkingData.findAndCountAll({
      limit: numPerPage,
      offset: offset,
      where: { locationId: locationId }
  })

  /*
  * Generate HATEOAS links for surrounding pages.
  */
  const lastPage = Math.ceil(result.count / numPerPage)
  const links = {}
  if (page < lastPage) {
      links.nextPage = `/parkingData?page=${page + 1}`
      links.lastPage = `/parkingData?page=${lastPage}`
  }
  if (page > 1) {
      links.prevPage = `/parkingData?page=${page - 1}`
      links.firstPage = '/parkingData?page=1'
  }

  /*
  * Construct and send response.
  */
  res.status(200).json({
  parkingData: result.rows,
  pageNumber: page,
  totalPages: lastPage,
  pageSize: numPerPage,
  totalCount: result.count,
  links: links
  })
})


router.get('/:locationId/latest', async function (req, res) {
  const locationId = parseInt(req.params.locationId)

  const result = await getLatestData(locationId)
  if (result) {
      res.status(200).send(result)
    } else {
      next()
    }
})

module.exports = router;
