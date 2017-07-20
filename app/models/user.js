const bookshelf = require('../libs/bookshelf');
const knex = require('./../libs/knex');
const { roles: env_roles } = require('./../../app/config');
bookshelf.plugin('registry');

const { each } = require('lodash');

let User = bookshelf.Model.extend(
  {
    // instance methods
    tableName: 'users',
    tweets: function() {
      return this.hasMany('Tweet');
    },
    role: function() {
      return this.belongsTo('Role');
    },
    likes: function() {
      return this.hasMany('Like');
    }
  },
  {
    // static methods, objects
    rules: {
      signin: {
        email: 'required|email',
        password: 'required|min:5'
      },
      signup: {
        email: 'required|email|unique',
        password: 'required|min:5',
        first_name: 'required|min:5|max:30',
        last_name: 'required|min:5|max:30'
      },
      create: {
        email: 'required|email|unique',
        password: 'required|min:5',
        first_name: 'required|min:5|max:30',
        last_name: 'required|min:5|max:30',
        roles: 'required|array|in:' + env_roles.join()
      }
    },

    messages: {
      signin: {
        'required.email': 'Email is required',
        'email.email': 'Invalid email',
        'required.password': 'Password is required',
        'min.password': 'Length of password must be greater then 5'
      },
      signup: {
        'required.email': 'Email is required',
        'email.email': 'Invalid email',
        'required.password': 'Password is required',
        'min.password': 'Length of password must be greater then 5',
        'required.first_name': 'First name is required',
        'min.first_name': 'Length of first name must be greater then 5',
        'max.first_name': 'Length of first name must be less then 30',
        'required.last_name': 'Last name is required',
        'min.last_name': 'Length of last name must be greater then 5',
        'max.last_name': 'Length of last name must be less then 30',
        'array.roles': 'Roles must be array',
        'in.roles': 'The selected roles is invalid'
      }
    },

    getById: function(user_id, cb) {
      knex('users as u')
        .select(
          'u.id as id',
          'u.email as email',
          'u.roles as roles',
          'u.first_name as first_name',
          'u.last_name as last_name'
        )
        .where('u.id', user_id)
        .first()
        .then(user => {
          if (user) {
            user.roles = user.roles.split(',');
          }
          cb(null, user);
        })
        .catch(cb);
    },

    getList: function(cb) {
      knex('users as u')
        .select(
          'u.id as id',
          'u.email as email',
          'u.roles as roles',
          'u.first_name as first_name',
          'u.last_name as last_name'
        )
        .then(users => {
          each(users, user => (user.roles = user.roles.split(',')));
          cb(null, users);
        })
        .catch(cb);
    },

    insert: function(user, cb) {
      if (typeof user.roles !== 'string') {
        user.roles = user.roles.toString();
      }
      knex('users')
        .insert(user)
        .then(() => {
          cb(null);
        })
        .catch(cb);
    },

    update: function(user_id, user, cb) {
      knex('users as u')
        .update(user)
        .where('u.id', user_id)
        .then(() => {
          cb(null);
        })
        .catch(cb);
    },

    remove: function(user_id, cb) {
      knex('users')
        .where('users.id', user_id)
        .del()
        .then(() => {
          cb(null);
        })
        .catch(cb);
    }
  }
);

module.exports = bookshelf.model('User', User);
