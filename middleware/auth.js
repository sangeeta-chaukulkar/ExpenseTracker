const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = (req, res, next) => {

    try {
        const token = req.headers["authorization"];
        const email = String(jwt.verify(token, process.env.TOKEN_SECRET).email);
        User.findOne({email : email }).then(user => {
            req.user = user;
            next();
        }).catch(err => { throw new Error(err)})

      } catch(err) {
        console.log(err);
        return res.status(401).json({success: false})
      }

}

module.exports = {
    authenticate
}