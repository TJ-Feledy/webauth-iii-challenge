
exports.up = function(knex) {

  // Create a table with username, password, and department... all fields required and username should be unique.

  return knex.schema.createTable('users', tbl => {
    tbl.increments()
    tbl.string('username').notNullable().unique()
    tbl.string('password').notNullable()
    tbl.string('department').notNullable()
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users')
};
