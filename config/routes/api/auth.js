// This route will be responsible for generating jsonwebtoken for authenthication

const express = require('express')
const router = express.Router()

// @route GET api/auth


router.get('/', (req, res) => {
    res.send('Auth route')
})


module.exports = router;