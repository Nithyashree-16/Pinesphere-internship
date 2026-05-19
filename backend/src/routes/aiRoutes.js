const express = require('express')
const router  = express.Router()
const { classify, summarize } = require('../controllers/aiController')
const { protect } = require('../middleware/auth')

router.use(protect)

router.post('/classify',       classify)
router.get( '/summarize/:id',  summarize)

module.exports = router
