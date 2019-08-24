//This route will be responsible for fetching profile and updating profile

const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const config = require('config')
const request = require('request')

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
//@access Private -: requires middleware or token to access this route

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

//@route  PUT api/profile/experience   :- this route is protected for users privately to validate their experience which 
                                          //comes in an array in the profile schema
//@desc   PUT  experience profile  for user & posts -: this route populates all users experience,company and nested array
//@access Private -: requires middleware or token to access this route

router.put('/experience', [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
 
]
], async (req, res) => {
        const errors = validationResult(req)
        
        if (!errors.isEmpty) {
            res.status(400).json({errors: errors.array()})
        }

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;    // This will destructure the experience in the profileSchema

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }                    //This will create a data containing the experience object, the user submits at the front end.

        try {  // The try and catch method is used since we want to deal with the database

            const profile = await Profile.findOne({ user: req.user.id })
            
            profile.experience.unshift(newExp); // This will remove the experience[0] in the profileSchema and replace
                                                //  it with the newExp object which is assigned to the objectSchema

            await profile.save()  // This function saves the expected input experience profile fields at the front end

             return res.json(profile);
            
        }
        catch (error) {
            console.error(error.message)

            res.status(500).send("Server Error")
            
        }

})


//@route  DELETE api/profile/experience/:exp_id  :- this route is protected for users privately to remove their experience which 
                                          //is more like updating it by the placeholder :exp_id
//@desc   Remove  experience from profile  -: this route removes specific users experience, and all its nested
                                                          // objects like title, company, location, from and to
//@access Private -: requires middleware or token to access this route


router.delete('/experience/:exp_id', auth, async (req, res)=>{
    try {
        const profile = await Profile.findOne({ user: req.user.id })   // This is to get the profile of the loggedin user 
                                                                      //you want to remove from the token
        
        // Get remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id); // This is to get the index
                                                                                            // of the same loggedin user
        
        profile.experience.splice(removeIndex, 1) // This is to splice the experience array of item at index(removeIndex)

        await profile.save(); // This is to resave it 

        res.json(profile) // To get the profile
    
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ msg: "Server Error" });
        
    
}
    

})





//@route  PUT api/profile/education   :- this route is protected for users privately to validate their education which 
//comes in an array in the profile schema
//@desc   PUT  education profile  for user & posts -: this route populates all users experience,company and nested array
//@access Private -: requires middleware or token to access this route

router.put('/education', [auth, [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Fieldofstudy is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()

]
], async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty) {
        res.status(400).json({ errors: errors.array() });
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;    // This will destructure the education in the profileSchema

        const newEdu = {
        
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }                    //This will create a data containing the education object, the user submits at the front end.

    try {  // The try and catch method is used since we want to deal with the database

        const profile = await Profile.findOne({ user: req.user.id })

        profile.education.unshift(newEdu); // This will remove the education[0] in the profileSchema and replace
        //  it with the newExp object which is assigned to the objectSchema

        await profile.save()  // This function saves the expected input education profile fields at the front end

        return res.json(profile);

    }
    catch (error) {
        console.error(error.message)

        res.status(500).send("Server Error")

    }

})


//@route  DELETE api/profile/education/:edu_id  :- this route is protected for users privately to remove their education 
                                                  //which is more like updating it by the placeholder :exp_id

//@desc   Remove education from profile  -: this route removes specific users education, and all its nested
                                               // objects like title, company, location, from and to

//@access Private -: requires middleware or token to access this route


router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })   // This is to get the profile of the loggedin user 
                                                                        //you want to remove from the token

        // Get remove index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id); // This is to get the index
                                                                                               // of the same loggedin user

        profile.education.splice(removeIndex, 1) // This is to splice the education array of item at index(removeIndex)

        await profile.save(); // This is to resave it 

        res.json(profile) // To get the profile

    } catch (error) {
        console.error(error.message)
        res.status(500).json({ msg: "Server Error" });


    }


})

//@route  GET api/profile/github/:username  :- this route is protected for users privately to get their github repo 
                                                   // by their username

//@desc   GET repo from github 

//@access Public -: viewing a profile is public , it concerns the public's repository;

router.get('/github/:username', (req, res) => {
    
    try {

        const options = {
            // The req.params.username is the username coming from the url for the user
            // sort=create date and we want it to be ascending(asc)
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc
            &client_id=${config.get('githubClientId')}&client_secret=${config.get('gitHubSecret')}`,
            method: 'GET',
            headers: {'user-agent': 'node.js'}
        }

        request(options, (error, response, body) => {
            if(error) console.error(error)

            if (response.statusCode !== 200) {
                res.status(400).json({msg: 'No Github profile found'})
            }

            res.json(JSON.parse(body));
        })
        
    }
    catch (error) {
        console.error(error.message)
        res.status(500).send("Server Error")
    }
})









module.exports = router;