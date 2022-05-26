const { ParkingData, ParkingDataClientFields } = require('.//models/parkingData')

router.post('/', requireAuthentication, async function (req, res, next) {
    if (await isUser(req.body.ownerId, req.user)) {
      try {
        const business = await Business.create(req.body, BusinessClientFields)
        res.status(201).send({ id: business.id })
      } catch (e) {
        if (e instanceof ValidationError) {
          res.status(400).send({ error: e.message })
        } else {
          throw e
        }
      }
    }
    else {
      res.status(403).send({
        err: "Invalid Authentication"
      })
    }
  })