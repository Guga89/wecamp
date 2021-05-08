const express = require('express')
const catchAsync = require('../utils/catchAsync')
const router = express.Router()
const { validateCamp } = require('../middlewares/middlewares')
const { isLoggedIn } = require('../middlewares/isLoggedIn')
const { isAuthor } = require('../middlewares/isAuthor')
const campgrounds = require('../controllers/campground')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })


router.get('/', catchAsync(campgrounds.showAll))
router.get('/new', isLoggedIn, campgrounds.newCampRender)
router.post('/new', isLoggedIn, upload.array('image'), validateCamp, catchAsync(campgrounds.createCamp))
router.get('/:id/show', catchAsync(campgrounds.showCamp))
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditCamp))
router.put('/:id/edit', isLoggedIn, isAuthor, validateCamp, catchAsync(campgrounds.editCamp))
router.delete('/:id/delete', isAuthor, catchAsync(campgrounds.deleteCamp))

module.exports = router