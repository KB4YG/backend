const { Router } = require('express')
const router = Router()

router.use('/locations', require('./locations'))
router.use('/parkingDatas', require('./parkingDatas'))
router.use('/counties', require('./counties'))
router.use('/recAreas', require('./recAreas'))

module.exports = router