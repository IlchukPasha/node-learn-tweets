const bookshelf = require('../libs/bookshelf');
var knex = require('./../libs/knex');
bookshelf.plugin('registry');

var Role = bookshelf.Model.extend({
    tableName: 'roles',
    users: function () {
        return this.hasMany('User');
    }
},{
    getRoleByTitle: function (title, cb) {
        knex('roles as role')
            .where('role.title', title)
            .first()
            .then(function (role) {
                cb(null, role);
            }).catch(function (err) {
                cb(err);
            });
    }
});

module.exports = bookshelf.model('Role', Role);