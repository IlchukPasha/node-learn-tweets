const bookshelf = require('../libs/bookshelf');
const knex = require('./../libs/knex');
const { omit } = require('lodash');
bookshelf.plugin('registry');

var User = bookshelf.Model.extend(
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
        role_id: 'required|role_exist'
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
        'max.first_name': 'Length of first name must be less then 5',
        'required.last_name': 'Last name is required',
        'min.last_name': 'Length of last name must be greater then 5',
        'max.last_name': 'Length of last name must be less then 30'
      }
    },

    getById: function(user_id, cb) {
      knex('users as u')
        .select(
          'u.id as id',
          'u.email as email',
          'r.title as role',
          'u.first_name as first_name',
          'u.last_name as last_name'
        )
        .where('u.id', user_id)
        .innerJoin('roles as r', 'u.role_id', 'r.id')
        .first()
        .then(user => {
          cb(null, user);
        })
        .catch(cb);
    },

    getList: function(cb) {
      knex('users as u')
        .select(
          'u.id as id',
          'u.email as email',
          'r.title as role',
          'u.first_name as first_name',
          'u.last_name as last_name'
        )
        .innerJoin('roles as r', 'u.role_id', 'r.id')
        .then(users => {
          cb(null, users);
        })
        .catch(cb);
    },

    insert: function(user, cb) {
      knex('users')
        .insert(user)
        .then(user_id => {
          cb(null, user_id);
        })
        .catch(cb);
    }
  }
);

module.exports = bookshelf.model('User', User);
