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
        businesses: result.rows,
        pageNumber: page,
        totalPages: lastPage,
        pageSize: numPerPage,
        totalCount: result.count,
        links: links
    })
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

module.exports = router;