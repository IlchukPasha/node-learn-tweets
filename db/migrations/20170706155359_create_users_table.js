
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', function (table) {
        table.increments();
        table.string('first_name', 30).notNullable().comment('First Name');
        table.string('last_name', 30).notNullable().comment('Last Name');
        table.string('email',50).notNullable().unique();
        table.string('password').notNullable();
        table.integer('role_id',10).notNullable().unsigned().index();
        table.foreign('role_id').references('roles.id').onDelete('CASCADE');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        table.collate('utf8_general_ci');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users');
};
