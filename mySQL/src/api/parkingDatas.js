const express = require('express')
const router = express.Router()

const { ValidationError } = require('sequelize')
const { ParkingData, ParkingDataClientFields, getLatestData} = require('../models/parkingData')

const { requireAuthentication } = require('../lib/auth')


router.get('/:dataID', async function (req, res) {
    const locationId = parseInt(req.params.locationId)
    let page = parseInt(req.query.page) || 1
    page = page < 1 ? 1 : page
    const numPerPage = 10
    const offset = (page - 1) * numPerPage

    const result = await ParkingData.findAndCountAll({
        limit: numPerPage,
        offset: offset,
        where: { id: dataID }
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

//TODO: add error handling seems to break if locationId is an invalid one
router.post('/',requireAuthentication,  async function (req, res) {
    try {
      const location = await ParkingData.create(req.body, ParkingDataClientFields)
      res.status(201).send({ id: location.id })
    } catch (e) {
      if (e instanceof ValidationError) {
        res.status(400).send({ error: e.message })
      } else {
        throw e
      }
    }
  })
  
  router.patch('/:dataID', requireAuthentication, async function (req, res, next) {
    const dataID = req.params.dataID
    const result = await ParkingData.update(req.body, {
      where: { id: dataID },
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
  router.delete('/:dataID', requireAuthentication, async function (req, res, next) {
    const dataID = req.params.dataID
    const result = await ParkingData.destroy({ where: { id: dataID }})
    if (result > 0) {
      res.status(204).send()
    } else {
      next()
    }
  })

module.exports = router;