const express = require('express')
const router = express.Router()

const { ValidationError } = require('sequelize')
const { Image, ImageClientFields } = require('../models/image')

const { requireAuthentication } = require('../lib/auth')


router.get('/:imageId', async function (req, res, next) {
  const imageId = parseInt(req.params.imageId)
  const image = await Image.findByPk(imageId)
  if (image) {
    res.status(200).send(image)
  } else {
    next()
  }
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