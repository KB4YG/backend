const { Router } = require('express')
const router = Router()

router.use('/locations', require('./locations'))
router.use('/parkingDatas', require('./parkingDatas'))
router.use('/images', require('./images'))
router.use('/users', require('./users'))

module.exports = router