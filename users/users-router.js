const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Users = require('./users-model.js')

// ***endpoints start with /api/users***

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

//***********Create a JWT for a user*************
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

module.exports = router