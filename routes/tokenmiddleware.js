const jwt = require('jsonwebtoken');
const config = require('../settings/config');

//Auth middleware function
module.exports = (req, res, next) => {
    try {
        //get token from header
        const token = req.header('token');
        
        //check if token is avilble on header if not return
        if(!token) return res.status(401).send({status: false, message:'Access Denied'});

        //if token available check is valid or not(It return Payload if valid token)
        const verify = jwt.verify(token, config.secret.token);

        //if valid proceed to Next
        req.user = verify;
        next();

    } catch (error) {
        res.status(400).send({status: false, message:'Invalid Token'})
    }
}