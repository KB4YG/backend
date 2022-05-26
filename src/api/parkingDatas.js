const express = require('express')
const router = express.Router()
const { ParkingData } = require('../models/parkingData')


router.get('/:locationId', async function (req, res) {
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

module.exports = router