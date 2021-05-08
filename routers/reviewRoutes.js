const express = require('express')
const catchAsync = require('../utils/catchAsync')
const router = express.Router({ mergeParams: true })
const { validateReview } = require('../middlewares/middlewares')
const { isLoggedIn } = require('../middlewares/isLoggedIn')
const { isAuthorReview } = require('../middlewares/isAuthorReview')
const reviews = require('../controllers/review')

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.addReview))
router.delete('/:reviewID', isLoggedIn, isAuthorReview, catchAsync(reviews.deleteReview))

module.exports = router