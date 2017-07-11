const bookshelf = require('../libs/bookshelf');
const knex = require('./../libs/knex');
const {omit} = require('lodash');
bookshelf.plugin('registry');

var User = bookshelf.Model.extend(
  {
    // instance methods
    tableName: 'users',
    tweets: function () {
      return this.hasMany('Tweet');
    },
    role: function () {
      return this.belongsTo('Role');
    },
    likes: function () {
      return this.hasMany('Like');
    }
  },
  {
    // static methods
    signinRules: function () {
      return {
        email: 'required|email',
        password: 'required|min:5'
      };
    },
    signinMessages: function () {
      return {
        'required.email': 'Email is required',
        'email.email': 'Invalid email',
        'required.password': 'Password is required',
        'min.password': 'Length of password must be greater then 5'
      };
    },
    signupRules: function () {
      return {
        email: 'required|email|unique',
        password: 'required|min:5',
        first_name: 'required|min:5|max:30',
        last_name: 'required|min:5|max:30'
      };
    },
    signupMessages: function () {
      return {
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
      };
    },
    getUserById: function (user_id, cb) {
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
        .then(function (user) {
          cb(null, user);
        })
        .catch(function (err) {
          cb(err);
        });
    },
    getAllUsers: function (cb) {
      knex('users as u')
        .select(
          'u.id as id',
          'u.email as email',
          'r.title as role',
          'u.first_name as first_name',
          'u.last_name as last_name'
        )
        .innerJoin('roles as r', 'u.role_id', 'r.id')
        .then(function (users) {
          cb(null, users);
        })
        .catch(function (err) {
          cb(err);
        });
    }
  }
);

module.exports = bookshelf.model('User', User);
