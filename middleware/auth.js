const jwt = require('jsonwebtoken');
const config = require('config')

// This is a middleware function: it is a function that has access to the req and res object or cycle , 
//then the next is a callback
module.exports = function (req, res, next) {
//     // get token from the header
    const token = req.header('x-auth-token')

//     // check if not token
    if (!token) {
        return res.status(401).json({msg: 'No token, authorisation failed'})
    }
// // verify the token
    try {
        
        const decoded = jwt.verify(token, config.get('jwtSecret'))// the token is what is coming from the header

        req.user = decoded.user // the req in the header is assigning the value of the user in the payload object to the
        //user in the request Object coming from the header
        next();

    } catch (error) {
        res.status(401).json({msg: 'Token is not valid '})
        
    }
}