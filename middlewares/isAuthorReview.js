const Review = require('../models/review')


module.exports.isAuthorReview = async (req, res, next) => {
    const { id, reviewID } = req.params
    const review = await Review.findById(reviewID)
    console.log(review)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', "You don't own this review")
        return (res.redirect(`/${id}/show`))
    }
    next()
}