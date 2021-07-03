const db = require('../data/db-config')

module.exports = {
  add,
  find,
  findById,
  findBy
}

function find() {
  // find all users

  return db('users')
}

function findBy(info) {
  // find user by certain criteria

  return db('users').where(info)
}

function findById(id) {
  // find user by their ID

  return db('users').where({id}).first()
}

function add(user) {
  // add a new user and return the new user's info

  db('users').insert(user)
    .then(ids => {
      return findById({id: ids[0]})
    })
}