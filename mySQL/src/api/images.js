const express = require('express')
const router = express.Router()

const { ValidationError } = require('sequelize')
const { Image, ImageClientFields } = require('../models/image')

const { requireAuthentication } = require('../lib/auth')


router.get('/:locationId', async function (req, res) {
  const locationId = parseInt(req.params.locationId)
  let page = parseInt(req.query.page) || 1
  page = page < 1 ? 1 : page
  const numPerPage = 10
  const offset = (page - 1) * numPerPage

  const result = await Image.findAndCountAll({
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
    images: result.rows,
    pageNumber: page,
    totalPages: lastPage,
    pageSize: numPerPage,
    totalCount: result.count,
    links: links
  })
})

router.post('/', requireAuthentication, async function (req, res) {
  try {
    const image = await Image.create(req.body, ImageClientFields)
    res.status(201).send({ id: image.id })
  } catch (e) {
    if (e instanceof ValidationError) {
      res.status(400).send({ error: e.message })
    } else {
      throw e
    }
  }
})

router.patch('/:imageId', requireAuthentication, async function (req, res, next) {
  const imageId = req.params.imageId
  const result = await Image.update(req.body, {
    where: { id: imageId },
    fields: ImageClientFields
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
router.delete('/:imageId', requireAuthentication, async function (req, res, next) {
  const imageId = req.params.imageId
  const result = await Image.destroy({ where: { id: imageId }})
  if (result > 0) {
    res.status(204).send()
  } else {
    next()
  }
})

module.exports = router;