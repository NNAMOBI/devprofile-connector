//This route will be responsible for fetching profile and updating profile

const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')

const Profile = require('../../../models/profile')
const User = require('../../../models/User')
const {check, validationResult} = require('express-validator')

// @route GET api/profile/me ---the endpoint api/profile will fetch all profile from the database but api/profile/me will
// get only the profile for the user based on the object id

//@desc get current users profile

// @access private : require token so we need to import the jwt library and auth middleware

router.get('/me', auth, async (req, res) => {

    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar'])

        if (!profile) {
            res.status(400).json({ msg: "There is no profile for this user" });
        }
        res.json(profile);
     
    }
    catch (error) {
        console.error(error.message)
        res.status(200).send('Server Error')
        
    }
    
})

//@route POST api/profile
//@desc create or update user profile
//@access Private


router.post('/', [auth, [
    check('status', 'status is required').not().isEmpty(),
    check('skills', 'skills is required').not().isEmpty()
]], async (req, res) => {
     
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }


        const {
            company,
            website,
            location,
            status,
            skills,
            bio,
            githubusername,
            linkedin,
            youtube,
            facebook,
            instagram,
            twitter
        } = req.body

        // buid profile object/ fields

        const profileFields = {}                         // This is to check if the variables destructured above are
                                                           //present before we save them to the database
        
        profileFields.user = req.user.id   // The profileFields.user is the user in the mongoose and it is been assigned 
                                                              // the req.user.id coming from the token in the header been verified by auth
        if (company) profileFields.company = company;             //the company here in the model is been assigned to profileFields obj
        if (website) profileFields.website = website;             // same here
        if (location) profileFields.location = location;            //same here
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = skills.split(',').map(skills => skills.trim())
        
        }
        console.log(profileFields.skills)
        
        
        // build social objects to assign the model to the variables to  what  we want to save them ,
        // the objects in the db will recognize them

        profileFields.social = {}  /// if you dont initialized the variable, after assigning them, it will throw an error.

        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        try {

            let profile = await Profile.findOne({ user: req.user.id })
            
            if (profile) {
                // update
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true })
                
                    return res.json(profile)
            }
          
                    // if the profile is found in the if statement above , 
                    //the profile will update else if will create and save to the db.
            
            // so lets create and save to the database

            profile = new Profile(profileFields)

            await profile.save();
            res.json(profile)
            
        } catch (error) {
            console.error(error.message)

            res.status(500).send('Server Error')
            
        
        }



})


//@route api/profile
//@desc  GET all profile -: this route populates all registered users profile
//@access Public -: doesn't require middleware or token to access this route

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
        
        
    }
    catch (error) {
        console.error(error.message)
        res.status(500).send('Server Error')
    }
    
})


//@route POST api/profile/user/:user_id ---the endpoint api/profile/me will fetch the current users profile from the
//database by extracting the req.user.id from the token  but api / profile / user/ :user_id will fetch 
//the users profile base on the user id in the Profile schema(mongoose.schema.types.objectId)

//@desc get current users profile by  :user_id in the UserSchema referenced from the ProfileSchema

// @access Public : doesn't require token so we don't need to import the jwt library and auth middleware,
//The users will only use their userid to access this route

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
        if (!profile) {
           return res.status(400).json({msg: "There is no profile for this user"})
        }
        res.json(profile);
        
        
    }
    catch (error) {
        console.error(error.message)
        if (error.kind == 'ObjectId') {
        
            return res.status(400).json({ msg: "Profile not found" })
        }
        res.status(500).send('Server Error')
    }
    
})


//@route  DELETE api/profile
//@desc   DELETE profile ,user & posts -: this route populates all registered users profile
//@access Public -: requires middleware or token to access this route

router.delete('/', auth, async (req, res) => {
    try {

       // @todo - remove user posts

       //Remove profile from the db
        await Profile.findOneAndRemove({ user: req.user.id }) // The user key is the user for the ProfileSchema
        
        //Remove user from the db
        await User.findOneAndRemove({ _id: req.user.id }) // the _id  is the id generated for each user by monogdb
        
        res.json({msg: " User removed"});
        
        
    }
    catch (error) {
        console.error(error.message)
        res.status(500).send('Server Error')
    }
    
})






module.exports = router;