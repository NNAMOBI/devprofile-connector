//This route will be responsible for posting to the backend what user post,comments,likes through the post dashboard

const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../../../middleware/auth')

// @route POST api/posts
// @desc  Create a post
// @access Private- Users have to login before they can post comments, likes and others,so we have to import our auth
//                  middleware

// we will have to bring all of our models into  this route because we will need it.
const Profile = require('../../../models/profile')
const Post = require('../../../models/post')
const User = require('../../../models/User')



router.post('/', [auth, [
    check('text', 'Text is required').not().isEmpty() // we don't need to validate the name and the avatar input ,we will
                                                         //verify that from the token sent from the user
]], async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})

        }
        try {
            const user = await User.findById(req.user.id).select('-password') // the req.user.id is the id coming fron the
                                                                              // token
            const newPost = new Post({  // instatiate new Post from the Post model created
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            })

            const post = await newPost.save();
            res.json(post);
            
        } catch (error) {
            console.error(error.message)
            res.status(500).send('Server Error')
        }

        
    
})

// @route GET api/posts
// @desc  get all users post
// @access Private-  Users have to login before they can see comments, likes and others,so we have to import our auth
//                  middleware

router.get('/', auth, async (req, res) => {
    
    try {
        const posts = await Post.find().sort({date: -1})// -1 sorts the recent post ,while 1 sorts the oldest post
        res.json(posts) 
        
    } catch (error) {
        console.error(error.message)
        res.status(500).json('Server Error')
        
    }
})




// @route GET api/posts/:id
// @desc  GET users post by id
// @access Private or public -  Users have to login before they can see comments, likes and others,so we have to import our auth
//                  middleware

router.get('/:id', auth, async (req, res) => {

    try {
        const posts = await Post.findById(req.params.id);

        if (!posts) {
            res.status(404).json({error: "Post not found"})
        }
        res.json(posts)

    } catch (error) {
        console.error(error.message)

        if (error.kind === "ObjectId") {
            res.status(404).json({ error: "Post not found" })
        }
        res.status(500).json('Server Error')

    }
})



// @route DELETE api/posts/:id
// @desc  DELETE users post by id
// @access Private 

router.delete('/:id', auth, async (req, res) => {

    try {
        const post = await Post.findById(req.params.id); // the request parameter (req) is to accept a id as parmaeter while
                                                         // making the request to the backend, and inturn returning the value.
                                                         

        if (!posts) {
            res.status(404).json({ error: "Post not found" })
        }

        //CHECK to avoid any user / person that has access to the token to delete any one's post


        if (post.user.toString() !== req.user.id) { // the req.user.id is a string embeded in the token , so we have to 
                                                    // convert the post.user to a string so they can match.
             return res.status(401).json({ error: "User not authorized" })
        }
        await post.remove();
        res.json({ msg: "Post removed" })

    } catch (error) {
        console.error(error.message)

        if (error.kind === "ObjectId") {
            res.status(404).json({ error: "Post not found" })
        }
        res.status(500).json('Server Error')

    }
})

// @route PUT api/posts/like/:id // We need to know the id of the post that is been liked.
// @desc  like the  post of the user who has the id
// @access Private 

router.put('/like/:id', auth, async (req, res) => {
    
    try {

        const post = await Post.findById(req.params.id)//if you have forgotten req.params.id means,goto Video @myPC called 
                                              // Request parameters(Path variables) in Express -Node.js Tutorial 4-YouTube
        
        // Check if the post has already been liked, we want to avoid the post been liked infinite times
        
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {// Means it has already been liked
            
            return res.status(400).json('Post already liked')
        }

        post.likes.unshift({ user: req.user.id })
        
        await post.save();

        res.json(post.likes)
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json('Server Error')

        
    }
})

// @route PUT api/posts/unlike/:id // We need to know the id of the post that is been unliked.
// @desc  unlike the  post of the user who has the id
// @access Private 

router.put('/unlike/:id', auth, async (req, res) => {

    try {

        const post = await Post.findById(req.params.id)//if you have forgotten req.params.id means,goto Video @myPC called 
        // Request parameters(Path variables) in Express -Node.js Tutorial 4-YouTube

        // Check if the post has already been liked, we want to avoid the post been liked infinite times

        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                                                                 // Means it has not yet been liked,
                                                                   //cos it has to be liked  first,before you can unlike it

            return res.status(400).json('Post has not yet been liked')
        }

     // Get remove index;
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        post.likes.splice(removeIndex, 1);

        await post.save();

        res.json(post.likes)

    } catch (error) {
        console.log(error.message)
        res.status(500).json('Server Error')


    }
})






module.exports = router;