const bookshelf = require('../libs/bookshelf');
let knex = require('./../libs/knex');
bookshelf.plugin('registry');

let Role = bookshelf.Model.extend(
  {
    tableName: 'roles',
    users: function() {
      return this.hasMany('User');
    }
  },
  {
    getByTitle: function(title, cb) {
      knex('roles as role')
        .where('role.title', title)
        .first()
        .then(function(role) {
          cb(null, role);
        })
        .catch(cb);
    },

    getList: function(cb) {
      knex('roles as r')
        .select('r.id as id', 'r.title as title')
        .then(roles => {
          cb(null, roles);
        })
        .catch(cb);
    }
  }
);

module.exports = bookshelf.model('Role', Role);
