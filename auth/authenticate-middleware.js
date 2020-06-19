/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

const jwt = require('jsonwebtoken');

const constants = require('../config/constants.js')

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  const secret = constants.jwtSecret;
  if (token) {
    jwt.verify(token, secret, (err, decodedToken) => {
        if (err) {
          console.log(err)
          res.status(201).json({message: 'Invalid Token'})
        } else {
          req.decodedToken = decodedToken;
          next();
        }
    });
  } else {
    res.status(401).json({ you: "shall not pass!" });
  }
};
