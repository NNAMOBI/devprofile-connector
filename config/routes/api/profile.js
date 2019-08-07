//This route will be responsible for fetching profile and updating profile

const express = require('express')
const router = express.Router()

// @route GET api/profile
// @access public : doesn't require token

router.get('/', (req, res) => {
    res.send('profile route')
})


module.exports = router;