const express = require('express')
const catchAsync = require('../utils/catchAsync')
const router = express.Router()
const ExpressError = require('../utils/ExpressErrors')
const { validateCamp } = require('../middlewares/middlewares')
const Campground = require('../models/campground')
const Review = require('../models/review')

router.get('/', catchAsync(async (req, res, next) => {
    const allCamps = await Campground.find({})
    res.render('campgrounds', { allCamps })
}))
router.get('/new', (req, res) => {
    res.render('newCamp')
})
router.post('/new', validateCamp, catchAsync(async (req, res) => {
    const camp = req.body
    const newCamp = new Campground({ ...camp })
    const campObj = await newCamp.save()
    req.flash('success', 'Campground successfully created!')
    res.redirect(`/${campObj._id}/show`)
}))
router.get('/:id/show', catchAsync(async (req, res) => {
    const foundCamp = await Campground.findById(req.params.id).populate("reviews")
    res.render('showCamp', { foundCamp })
}))
router.get('/:id/edit', catchAsync(async (req, res) => {
    const foundCamp = await Campground.findById(req.params.id)
    res.render('editCamp', { foundCamp })
}))
router.put('/:id/edit', validateCamp, catchAsync(async (req, res) => {
    const foundCamp = await Campground.findByIdAndUpdate(req.params.id, { ...req.body })
    req.flash('success', 'Campground successfully edited!')
    res.redirect(`/${foundCamp._id}/show`)
}))

router.delete('/:id/delete', catchAsync(async (req, res) => {
    const foundCamp = await Campground.findByIdAndDelete(req.params.id)
    req.flash('success', 'Campground successfully deleted!')
    res.redirect('/')
}))

module.exports = router