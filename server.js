const express = require('express')

require('dotenv').config()

console.log(process.env.JWT_SECRET)

const usersRouter = require('./users/users-router.js')

const server = express()

server.use(express.json())

server.use('/api/users', usersRouter)

server.get('/', (req, res) => {
  res.send('Here.. we.. GO!')
})

module.exports = server