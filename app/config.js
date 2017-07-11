const path = require("path");

let config = {
  secret: '12qw34er56ty',
  db: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      user: 'root',
      password: '123456',
      database: 'twitter_like_db',
      port: '3306'
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.join(__dirname, "/", "..", "db", "migrations")
    },
    seeds: {
      directory: path.join(__dirname, "/", "..", "db", "seeds")
    }
  }
};

switch (process.env.NODE_ENV) {
  case 'production':
    config.db.connection.host = 'production_host';
    config.db.connection.user = 'production_user';
    config.db.connection.password = 'production_password';
    config.db.connection.database = 'production_database';
    break;
  default:
    break;
}
module.exports = config;