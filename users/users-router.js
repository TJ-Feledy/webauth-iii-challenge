const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Users = require('./users-model.js')

// ***endpoints start with /api/users***

// Register endpoint:
router.post('/register', (req, res) => {
  let user = req.body
  const hash = bcrypt.hashSync(user.password, 10)
  user.password = hash

  Users.add(user)
    .then(newUser => {
      const token = generateToken(newUser)

      res.status(201).json({
        user: newUser,
        token
      })
    })
    .catch(err => {
      res.status(500).json({ errorMessage: `${err}` })
    })
})

// Login endpoint:
router.post('/login', (req, res) => {
  const {username, password} = req.body

  Users.findBy({username}).first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user)

        res.status(200).json({
          message: `${user.username}, you shall pass.`,
          token
        })
      }else {
        res.status(401).json({ message: 'You shall not pass!' })
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: `${err}` })
    })
})

// Get users endpoint:
router.get('/', restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users)
    })
    .catch(err => {
      res.status(500).json({ errorMessage: `${err}` })
    })
})

//***********Create a JWT for a user ( middleware )*************
function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username
  }

  const options = {
    expiresIn: '1d'
  }

  return jwt.sign(payload, process.env.JWT_SECRET, options)
}

//***********Restricted Middleware***************
function restricted(req, res, next) {
  const token = req.headers.authorization

  // check for a token and see if it is valid
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: 'not verified' })
      }else {
        req.decodedToken = decodedToken
        next()
      }
    })
  }else {
    res.status(400).json({ message: 'You shall not pass!' })
  }
}

module.exports = router