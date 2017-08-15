
exports.up = function(knex, Promise) {
    return knex.schema.createTable('tweets', function (table) {
        table.increments();
        table.text('message').notNullable();
        table.string('image', 100).comment('Path to image');
        table.integer('user_id',10).notNullable().unsigned().index();
        table.foreign('user_id').references('users.id').onDelete('CASCADE');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        table.collate('utf8_general_ci');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('tweets');
};
