//This route will be responsible for posting forms to the backend

const express = require('express')
const router = express.Router()

// @route GET api/post


router.get('/', (req, res) => {
    res.send('post route')
})


module.exports = router;