const router = require('express').Router();

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

const constants = require('../config/constants.js')

const db = require('../database/dbConfig.js')

function createToken(user){
  const payload = {
    subject: user[0].id,
    username: user[0].username
  };
  const secret = constants.jwtSecret;
  const options = {
    expiresIn: '1d'
  };
  return jwt.sign(payload, secret, options)
}

router.post('/register', (req, res) => {
  if (!req.body.username || !req.body.password){
    res.status(401).json({message: `Username AND Password are REQUIRED!`})
  } else {
  const rounds = process.env.HASH_ROUNDS || 10;
  const hash = bcrypt.hashSync(req.body.password, rounds)
  db('users')
    .insert({
      username: req.body.username,
      password: hash
    })
    .then(user => res.status(200).json(`Thank you for Registering! Your ID number is ${user}`))
    .catch(err => {
      console.log(err)
      res.status(500).json('An Error occurred while trying to register')
    })
  }
});

router.post('/login', (req, res) => {
  if (!req.body.username || !req.body.password){
    res.status(401).json({message: `Username AND Password are REQUIRED!`})
  } else {
    db('users')
      .select("*")
      .where({username: req.body.username})
      .then(user => {
        console.log(user)
        if (user.length === 0) {
          res.status(401).json('Invalid Credentials')
        } else if (user.length > 0 && bcrypt.compareSync(req.body.password, user[0].password)){
          const token = createToken(user);
          res.status(200).json({
            message: `Welcome back ${user[0].username}!`,
            token
          })
        } else {
          res.status(401).json({message: 'You shall not pass!'})
        }
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({message: 'An Error occurred while attempting to log you in'})
      })
  }
});

module.exports = router;
