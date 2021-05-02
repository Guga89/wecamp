const express = require('express')
const catchAsync = require('../utils/catchAsync')
const router = express.Router()
const { validateReview } = require('../middlewares/middlewares')
const Review = require('../models/review')
const Campground = require('../models/campground')

router.post('/:id', validateReview, catchAsync(async (req, res) => {
    const foundCamp = await Campground.findById(req.params.id)
    const review = new Review({ ...req.body })
    foundCamp.reviews.push(review)
    foundCamp.save()
    review.save()
    res.redirect(`/${foundCamp._id}/show`)
}))
router.delete('/:id/:reviewID', catchAsync(async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, { $pull: { reviews: req.params.reviewID } })
    await Review.findByIdAndRemove(req.params.reviewID)
    res.redirect(`/${req.params.id}/show`)
}))

module.exports = router