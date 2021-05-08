const Review = require('../models/review')
const Campground = require('../models/campground')

module.exports.addReview = async (req, res) => {
    const foundCamp = await Campground.findById(req.params.id)
    const review = new Review({ ...req.body })
    review.author = req.user._id
    foundCamp.reviews.push(review)
    await foundCamp.save()
    await review.save()
    req.flash('success', 'Review successfully added!')
    res.redirect(`/${foundCamp._id}/show`)
}

module.exports.deleteReview = async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, { $pull: { reviews: req.params.reviewID } })
    await Review.findByIdAndRemove(req.params.reviewID)
    req.flash('success', 'Review successfully deleted!')
    res.redirect(`/${req.params.id}/show`)
}