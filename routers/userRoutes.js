const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')

router.get('/register', (req, res) => {
    res.render('users/register')
})
router.post('/register', catchAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const userRegister = await User.register(user, password)
        req.flash('success', 'Welcom to Yelp Camp!')
        res.redirect('/')
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login')
})
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', "Welcome back!")
    res.redirect('/')
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/');
})
module.exports = router