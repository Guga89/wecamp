const Campground = require('../models/campground')


module.exports.isAuthor = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', "You don't have permission to edit this camp")
        return (res.redirect(`/${campground._id}/show`))
    }
    next()
}