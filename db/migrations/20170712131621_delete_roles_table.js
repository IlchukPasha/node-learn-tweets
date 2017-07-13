exports.up = function(knex, Promise) {
  return knex.schema.dropTable('roles');
};

exports.down = function(knex, Promise) {
  return knex.schema.createTable('roles', function(table) {
    table.increments('id');
    table.string('title', 20).notNullable().unique();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.collate('utf8_general_ci');
  });
};
