exports.up = function(knex, Promise) {
  return knex.schema.table('users', table => {
    table.dropForeign('role_id');
    table.dropColumn('role_id');
    table.string('roles', 100).notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', table => {
    table.dropColumn('roles');
    table.integer('role_id', 10).notNullable().unsigned().index();
    table.foreign('role_id').references('roles.id').onDelete('CASCADE');
  });
};
