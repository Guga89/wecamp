const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.get('/', (req, res) => {
    res.render('users/register')
})
router.post('/', async (req, res) => {
    res.send(req.body)
})

module.exports = router