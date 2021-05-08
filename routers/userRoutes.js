const express = require('express')
const router = express.Router()
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')
const users = require('../controllers/user')

// router.get('/register', users.renderRegisterForm)
// router.post('/register', catchAsync(users.registerUser))
// router.get('/login', users.loginFormRender)
// router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.route('/register')
    .get(users.renderRegisterForm)
    .post(catchAsync(users.registerUser))

router.route('/login')
    .get(users.loginFormRender)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)


router.get('/logout', users.logout)

module.exports = router