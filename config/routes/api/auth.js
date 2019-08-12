// This route will be responsible for generating jsonwebtoken for authenthication and login

const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs');


// we want to make a call to the database to verify the user in the token with the user in the database.
// so let us import the User, and make it a middleware in the protected route
const User = require('../../../models/User')

// @route GET api/auth

// the auth is a middleware that makes this route protected.
                                          // we imported the jwt.verify as a middleware and auth is a variable holding 
                                          //the verify


                                         // req.user.id is the decoded token used to find
                                         // the User's id obejct in the db imported from the
                                          //auth.js middleware folder
router.get('/', auth, async (req, res) => { 
    
    try { 
        const user = await User.findById(req.user.id).select('-password') 
        
        return res.status(200).json(user)                                                            
        
                                                     
      
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error")
      
  }                                    

   
})

// @route Post api / auth/ login route
// @route Aunthenticate users & get token
// @access public : doesn't require token




router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'password is required').exists()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })// status code 400 means it is a bad request 
        //but status code 200 means it is ok

    }

    // console.log(req.body)

        const { email, password } = req.body;
    try {
        // The next work flow
        // step1 - see if the user exist in the database(if he doesn't exist then it will return a 400 error)

        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'invalid credentials' }] })
        }
        // step2 - compare the password inputed by the user in the login field with the encrypted user in the database
        // bcrypt has a method that compares both called bcrypt.compare()

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({errors: [{ msg:'invalid credentials'}]})
        }
        


        // step 2 - return jsonwebtoken
        payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
            if (err) {
                throw err;
            } else {
                res.json({ token });
            }


        })

        // res.send('user Registered')
    } catch (error) {
        console.error(error.message)
        res.status(500).send('server error')
    }


})





module.exports = router;