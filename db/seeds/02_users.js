const bcrypt = require('bcrypt-nodejs');
const salt = bcrypt.genSaltSync(10);

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del().then(function() {
    // Inserts seed entries
    return knex('users').insert([
      {
        id: 1,
        first_name: 'admin',
        last_name: 'admin',
        email: 'admin@admin.com',
        password: bcrypt.hashSync('password', salt),
        role_id: 1
      },
      {
        id: 2,
        first_name: 'user_first_name',
        last_name: 'user_last_name',
        email: 'user@user.com',
        password: bcrypt.hashSync('password', salt),
        role_id: 2
      },
      {
        id: 3,
        first_name: 'user2_first_name',
        last_name: 'user2_last_name',
        email: 'user2@user2.com',
        password: bcrypt.hashSync('password', salt),
        role_id: 2
      }
    ]);
  });
};
