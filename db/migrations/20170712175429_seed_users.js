const bcrypt = require('bcrypt-nodejs');
const salt = bcrypt.genSaltSync(10);

exports.up = knex => {
  return knex.table('users').insert([
    {
      id: 1,
      first_name: 'admin',
      last_name: 'admin',
      email: 'admin@admin.com',
      password: bcrypt.hashSync('password', salt),
      roles: 'admin'
    },
    {
      id: 2,
      first_name: 'user_first_name',
      last_name: 'user_last_name',
      email: 'user@user.com',
      password: bcrypt.hashSync('password', salt),
      roles: 'user'
    },
    {
      id: 3,
      first_name: 'user2_first_name',
      last_name: 'user2_last_name',
      email: 'user2@user2.com',
      password: bcrypt.hashSync('password', salt),
      roles: 'admin,user'
    }
  ]);
};

exports.down = knex => {
  return knex.table('users').del();
};
