const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const compression = require('compression')
const router = express.Router()

router.use(compression())
router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

const { ValidationError } = require('sequelize')
const { Location, LocationClientFields } = require('../models/location')


router.get('/', async function (req, res) {
    let page = parseInt(req.query.page) || 1
    page = page < 1 ? 1 : page
    const numPerPage = 10
    const offset = (page - 1) * numPerPage

    const result = await Location.findAndCountAll({
        limit: numPerPage,
        offset: offset
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

router.get('/:businessId', async function (req, res, next) {
    const businessId = req.params.businessId
    const business = await Business.findByPk(businessId, {
      include: [ Photo, Review ]
    })
    if (business) {
      res.status(200).send(business)
    } else {
      next()
    }
  })

router.post('/', async function (req, res) {
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

router.patch('/:businessId', async function (req, res, next) {
    const businessId = req.params.businessId
    const result = await Business.update(req.body, {
      where: { id: businessId },
      fields: BusinessClientFields
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
  router.delete('/:businessId', async function (req, res, next) {
    const businessId = req.params.businessId
    const result = await Business.destroy({ where: { id: businessId }})
    if (result > 0) {
      res.status(204).send()
    } else {
      next()
    }
  })

module.exports = router;