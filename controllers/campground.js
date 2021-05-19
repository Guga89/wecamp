const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geoCoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

const Campground = require('../models/campground')
const { cloudinary } = require('../cloudinary/index')

module.exports.showAll = async (req, res, next) => {
    const allCamps = await Campground.find({})
    res.render('campgrounds', { allCamps })
}

module.exports.newCampRender = (req, res) => {
    res.render('newCamp')
}

module.exports.createCamp = async (req, res) => {
    const images = req.files.map((img) => {
        return { filename: img.filename, url: img.path }
    })
    const newCamp = new Campground({ ...req.body })
    newCamp.author = req.user._id
    newCamp.images = images
    //==============Geo location Map functionality==================
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send()
    newCamp.geometry = geoData.body.features[0].geometry;
    //==============================================================
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
    const images = req.files.map((img) => {
        return { filename: img.filename, url: img.path }
    })
    foundCamp.images.push(...images)
    await foundCamp.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await foundCamp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Campground successfully edited!')
    res.redirect(`/${foundCamp._id}/show`)
}

module.exports.deleteCamp = async (req, res) => {
    const foundCamp = await Campground.findByIdAndDelete(req.params.id)
    req.flash('success', 'Campground successfully deleted!')
    res.redirect('/')
}