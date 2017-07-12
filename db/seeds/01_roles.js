// knex seed:make 01_roles

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('roles').del()
    .then(function () {
      // Inserts seed entries
      return knex('roles').insert([
        {id: 1, title: 'admin'},
        {id: 2, title: 'user'}
      ]);
    });
};

// knex seed:run
