exports.up = function(knex, Promise) {
  return knex.table('likes').insert([
    {
      id: 1,
      tweet_id: 1,
      user_id: 1
    },
    {
      id: 2,
      tweet_id: 1,
      user_id: 2
    },
    {
      id: 3,
      tweet_id: 1,
      user_id: 4
    },
    {
      id: 4,
      tweet_id: 2,
      user_id: 3
    },
    {
      id: 5,
      tweet_id: 3,
      user_id: 5
    },
    {
      id: 6,
      tweet_id: 3,
      user_id: 4
    },
    {
      id: 7,
      tweet_id: 4,
      user_id: 1
    },
    {
      id: 8,
      tweet_id: 4,
      user_id: 2
    }
  ]);
};

exports.down = function(knex, Promise) {
  return knex.table('likes').del();
};
