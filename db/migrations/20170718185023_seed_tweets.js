exports.up = function(knex, Promise) {
  return knex.table('tweets').insert([
    {
      id: 1,
      message: 'tweet 1',
      image: 'public/images/uploaded/03ee79f4-56bf-4c02-8a58-97dda0ac2973.png',
      user_id: 1
    },
    {
      id: 2,
      message: 'tweet 2',
      image: 'public/images/uploaded/03ee79f4-56bf-4c02-8a58-97dda0ac2973.png',
      user_id: 2
    },
    {
      id: 3,
      message: 'tweet 3',
      image: null,
      user_id: 3
    },
    {
      id: 4,
      message: 'tweet 4',
      image: null,
      user_id: 4
    },
    {
      id: 5,
      message: 'tweet 5',
      image: 'public/images/uploaded/03ee79f4-56bf-4c02-8a58-97dda0ac2973.png',
      user_id: 5
    },
    {
      id: 6,
      message: 'tweet 6',
      image: null,
      user_id: 2
    },
    {
      id: 7,
      message: 'tweet 7',
      image: 'public/images/uploaded/03ee79f4-56bf-4c02-8a58-97dda0ac2973.png',
      user_id: 2
    },
    {
      id: 8,
      message: 'tweet 8',
      image: null,
      user_id: 1
    },
    {
      id: 9,
      message: 'tweet 9',
      image: 'public/images/uploaded/03ee79f4-56bf-4c02-8a58-97dda0ac2973.png',
      user_id: 1
    },
    {
      id: 10,
      message: 'tweet 10',
      image: null,
      user_id: 4
    }
  ]);
};

exports.down = function(knex, Promise) {
  return knex.table('tweets').del();
};
