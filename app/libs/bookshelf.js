var knex_config = require('../config').db;
var knex = require('knex')(knex_config);
module.exports = require('bookshelf')(knex);