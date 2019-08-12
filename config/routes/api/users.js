// this route will be responsible for adding users and registering users

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator')
const User = require('../../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const config = require('config')

// @route Post api/users
// @route Register users
// @access public : doesn't require token




router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({min: 6})
], async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })// status code 400 means it is a bad request 
            //but status code 200 means it is ok
            
        }
       
    // console.log(req.body)
        
        const { name, email, password } = req.body;
        try {
            // The next work flow
        // step1 - see if the user exist in the database(if he exist then we dont need to register the same email)
            
            let user = await User.findOne({ email })
            if (user) {
                return res.status(400).json({errors: [{msg: 'User already exist'}]})
            }
        // step2 - get users gravatar

            const avatar = gravatar.url(email, {
                s: "200",
                r: "pg",
                d: "mm" // d means default image just like a user icon
            })
            
             user = new User({
                name,
                email,
                avatar,
                password
            })
        // step 3 - bcyrpt password
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(password, salt)
            
            await user.save();
            
        // step 4 - return jsonwebtoken
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