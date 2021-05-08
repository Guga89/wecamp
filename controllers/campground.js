const Campground = require('../models/campground')

module.exports.showAll = async (req, res, next) => {
    const allCamps = await Campground.find({})
    res.render('campgrounds', { allCamps })
}

module.exports.newCampRender = (req, res) => {
    res.render('newCamp')
}

module.exports.createCamp = async (req, res) => {
    const camp = req.body
    const newCamp = new Campground({ ...camp })
    newCamp.author = req.user._id
    const campObj = await newCamp.save()
    req.flash('success', 'Campground successfully created!')
    res.redirect(`/${campObj._id}/show`)
}

module.exports.showCamp = async (req, res) => {
    const foundCamp = await (await Campground.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate('author'))
    res.render('showCamp', { foundCamp })
}

module.exports.renderEditCamp = async (req, res) => {
    const foundCamp = await Campground.findById(req.params.id)
    if (!foundCamp) {
        req.flash('error', "Sorry couldn't find the campground :(")
        return (res.redirect('/'))
    }
    res.render('editCamp', { foundCamp })
}

module.exports.editCamp = async (req, res) => {
    const foundCamp = await Campground.findByIdAndUpdate(req.params.id, { ...req.body })
    req.flash('success', 'Campground successfully edited!')
    res.redirect(`/${foundCamp._id}/show`)
}

module.exports.deleteCamp = async (req, res) => {
    const foundCamp = await Campground.findByIdAndDelete(req.params.id)
    req.flash('success', 'Campground successfully deleted!')
    res.redirect('/')
}