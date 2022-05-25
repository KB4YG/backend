const { Router } = require('express')
const router = Router()

router.use('/locations', require('./locations'))
//router.use('/parkingDatas', require('./parkingDatas'))

module.exports = router