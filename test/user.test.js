let assert = require('assert');
let { users } = require('./../app/controllers');
let app = require('./../app');
const agent = require('supertest').agent(app);
const knex = require('../app/libs/knex');
const jwt = require('jsonwebtoken');
const env = require('./../app/config');

let urls = {
  list: '/api/v1/users'
};

let token1 = jwt.sign({ id: 1 }, env.secret, { expiresIn: '120d' });
let token2 = jwt.sign({ id: 2 }, env.secret, { expiresIn: '120d' });

describe('users tests', () => {
  before(done => {
    knex.migrate
      .rollback()
      .then(() => {
        knex.migrate
          .latest()
          .then(() => {
            done();
          })
          .catch(err => {
            done(err);
          });
      })
      .catch(err => {
        done(err);
      });
  });

  it('get all users as admin', done => {
    agent.get(urls.list).set('authorization', token1).end((err, res) => {
      assert.equal(null, err);
      assert.equal(200, res.statusCode, 'status code must be 200');
      done();
    });
  });

  it('get all users as user', done => {
    agent.get(urls.list).set('authorization', token2).end((err, res) => {
      assert.equal(null, err);
      assert.equal(403, res.statusCode, 'status code must be 403');
      done();
    });
  });

  it('get user by id', done => {
    agent.get(urls.list + '/1').set('authorization', token1).end((err, res) => {
      assert.equal(null, err);
      assert.equal(200, res.statusCode, 'status code must be 200');
      done();
    });
  });

  it('get not existing user by id', done => {
    agent.get(urls.list + '/100').set('authorization', token1).end((err, res) => {
      assert.equal(null, err);
      assert.equal(404, res.statusCode, 'status code must be 404');
      done();
    });
  });

  it('get user without token', done => {
    agent.get(urls.list + '/1').end((err, res) => {
      assert.equal(null, err);
      assert.equal(401, res.statusCode, 'status code must be 401');
      done();
    });
  });

  it('get other user as admin user', done => {
    agent.get(urls.list + '/2').set('authorization', token1).end((err, res) => {
      assert.equal(null, err);
      assert.equal(200, res.statusCode, 'status code must be 200');
      done();
    });
  });

  it('get other user as not admin user', done => {
    agent.get(urls.list + '/1').set('authorization', token2).end((err, res) => {
      assert.equal(null, err);
      assert.equal(403, res.statusCode, 'status code must be 403');
      done();
    });
  });

  it('get user as owner', done => {
    agent.get(urls.list + '/2').set('authorization', token2).end((err, res) => {
      assert.equal(null, err);
      assert.equal(200, res.statusCode, 'status code must be 200');
      done();
    });
  });

  it('add user as admin', done => {
    agent
      .post(urls.list)
      .set('authorization', token1)
      .send({
        email: 'testuser1@testuser1.com',
        password: 'password',
        first_name: 'test_user_first_name',
        last_name: 'test_user_last_name',
        roles: ['user', 'admin']
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(201, res.statusCode, 'status code must be 201');
        done();
      });
  });

  it('add user as user', done => {
    agent
      .post(urls.list)
      .set('authorization', token2)
      .send({
        email: 'testuser1@testuser1.com',
        password: 'password',
        first_name: 'test_user_first_name',
        last_name: 'test_user_last_name',
        roles: ['user', 'admin']
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(403, res.statusCode, 'status code must be 403');
        done();
      });
  });

  it('add user as unauthorized user', done => {
    agent
      .post(urls.list)
      .send({
        email: 'testuser1@testuser1.com',
        password: 'password',
        first_name: 'test_user_first_name',
        last_name: 'test_user_last_name',
        roles: ['user', 'admin']
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(401, res.statusCode, 'status code must be 401');
        done();
      });
  });

  it('add user as admin without email', done => {
    agent
      .post(urls.list)
      .set('authorization', token1)
      .send({
        password: 'password',
        first_name: 'test_user_first_name',
        last_name: 'test_user_last_name',
        roles: ['user', 'admin']
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'status code must be 400');
        done();
      });
  });

  it('add user as admin with invalid email', done => {
    agent
      .post(urls.list)
      .set('authorization', token1)
      .send({
        email: 'testuser1',
        password: 'password',
        first_name: 'test_user_first_name',
        last_name: 'test_user_last_name',
        roles: ['user', 'admin']
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'status code must be 400');
        done();
      });
  });

  it('add user as admin with existing email', done => {
    agent
      .post(urls.list)
      .set('authorization', token1)
      .send({
        email: 'user@user.com',
        password: 'password',
        first_name: 'test_user_first_name',
        last_name: 'test_user_last_name',
        roles: ['user', 'admin']
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'status code must be 400');
        done();
      });
  });

  it('add user as admin without password', done => {
    agent
      .post(urls.list)
      .set('authorization', token1)
      .send({
        email: 'testuser2@testuser2.com',
        first_name: 'test_user_first_name',
        last_name: 'test_user_last_name',
        roles: ['user', 'admin']
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'status code must be 400');
        done();
      });
  });

  it('add user as admin with short password', done => {
    agent
      .post(urls.list)
      .set('authorization', token1)
      .send({
        email: 'testuser2@testuser2.com',
        password: 'pass',
        first_name: 'test_user_first_name',
        last_name: 'test_user_last_name',
        roles: ['user', 'admin']
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'status code must be 400');
        done();
      });
  });

  it('add user as admin without first name', done => {
    agent
      .post(urls.list)
      .set('authorization', token1)
      .send({
        email: 'testuser2@testuser2.com',
        password: 'password',
        last_name: 'test_user_last_name',
        roles: ['user', 'admin']
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'status code must be 400');
        done();
      });
  });

  it('add user as admin with short first name', done => {
    agent
      .post(urls.list)
      .set('authorization', token1)
      .send({
        email: 'testuser2@testuser2.com',
        password: 'password',
        first_name: 'firs',
        last_name: 'test_user_last_name',
        roles: ['user', 'admin']
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'status code must be 400');
        done();
      });
  });

  it('add user as admin with long first name', done => {
    agent
      .post(urls.list)
      .set('authorization', token1)
      .send({
        email: 'testuser2@testuser2.com',
        password: 'password',
        first_name: 'firstname_firstname_firstname_first',
        last_name: 'test_user_last_name',
        roles: ['user', 'admin']
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'status code must be 400');
        done();
      });
  });

  it('add user as admin without last name', done => {
    agent
      .post(urls.list)
      .set('authorization', token1)
      .send({
        email: 'testuser2@testuser2.com',
        password: 'password',
        first_name: 'firstname',
        roles: ['user', 'admin']
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'status code must be 400');
        done();
      });
  });

  it('add user as admin with short last name', done => {
    agent
      .post(urls.list)
      .set('authorization', token1)
      .send({
        email: 'testuser2@testuser2.com',
        password: 'password',
        first_name: 'firstname',
        last_name: 'last',
        roles: ['user', 'admin']
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'status code must be 400');
        done();
      });
  });

  it('add user as admin with long last name', done => {
    agent
      .post(urls.list)
      .set('authorization', token1)
      .send({
        email: 'testuser2@testuser2.com',
        password: 'password',
        first_name: 'firstname',
        last_name: 'lastname_lastname_lastname_lastname_',
        roles: ['user', 'admin']
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'status code must be 400');
        done();
      });
  });

  it('add user as admin without roles', done => {
    agent
      .post(urls.list)
      .set('authorization', token1)
      .send({
        email: 'testuser2@testuser2.com',
        password: 'password',
        first_name: 'first_name',
        last_name: 'last_name'
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'status code must be 400');
        done();
      });
  });

  it('add user as admin with not array roles', done => {
    agent
      .post(urls.list)
      .set('authorization', token1)
      .send({
        email: 'testuser2@testuser2.com',
        password: 'password',
        first_name: 'first_name',
        last_name: 'last_name',
        roles: 'admin'
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'status code must be 400');
        done();
      });
  });

  it('add user as admin with invalid roles', done => {
    agent
      .post(urls.list)
      .set('authorization', token1)
      .send({
        email: 'testuser2@testuser2.com',
        password: 'password',
        first_name: 'first_name',
        last_name: 'last_name',
        roles: ['admin', 'some']
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'status code must be 400');
        done();
      });
  });

  it('update not existing user', done => {
    agent
      .put(urls.list + '/100')
      .set('authorization', token1)
      .send({
        email: 'testuser2@testuser2.com',
        password: 'password',
        first_name: 'first_name',
        last_name: 'last_name',
        roles: ['admin']
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(404, res.statusCode, 'status code must be 404');
        done();
      });
  });

  it('update user as admin with existing email', done => {
    agent
      .put(urls.list + '/2')
      .set('authorization', token1)
      .send({
        email: 'user2@user2.com',
        password: 'password',
        first_name: 'first_name',
        last_name: 'last_name',
        roles: ['admin']
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'status code must be 400');
        done();
      });
  });

  it('update user as admin with owner existing email', done => {
    agent
      .put(urls.list + '/2')
      .set('authorization', token1)
      .send({
        email: 'user@user.com',
        password: 'password',
        first_name: 'first_name',
        last_name: 'last_name',
        roles: ['user']
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(200, res.statusCode, 'status code must be 200');
        done();
      });
  });

  it('update user as admin without email', done => {
    agent
      .put(urls.list + '/2')
      .set('authorization', token1)
      .send({
        password: 'password',
        first_name: 'first_name',
        last_name: 'last_name',
        roles: ['user']
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'status code must be 400');
        done();
      });
  });

  it('update user as admin with invalid email', done => {
    agent
      .put(urls.list + '/2')
      .set('authorization', token1)
      .send({
        email: 'email',
        password: 'password',
        first_name: 'first_name',
        last_name: 'last_name',
        roles: ['user']
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'status code must be 400');
        done();
      });
  });

  it('update user as admin without password', done => {
    agent
      .put(urls.list + '/2')
      .set('authorization', token1)
      .send({
        email: 'user@user.com',
        first_name: 'first_name',
        last_name: 'last_name',
        roles: ['user']
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'status code must be 400');
        done();
      });
  });

  it('update user as admin with short password', done => {
    agent
      .put(urls.list + '/2')
      .set('authorization', token1)
      .send({
        email: 'user@user.com',
        password: 'pass',
        first_name: 'first_name',
        last_name: 'last_name',
        roles: ['user']
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'status code must be 400');
        done();
      });
  });

  it('update user as admin without first name', done => {
    agent
      .put(urls.list + '/2')
      .set('authorization', token1)
      .send({
        email: 'user@user.com',
        password: 'password',
        last_name: 'last_name',
        roles: ['user']
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'status code must be 400');
        done();
      });
  });

  it('update user as admin with short first name', done => {
    agent
      .put(urls.list + '/2')
      .set('authorization', token1)
      .send({
        email: 'user@user.com',
        password: 'password',
        first_name: 'firs',
        last_name: 'last_name',
        roles: ['user']
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'status code must be 400');
        done();
      });
  });

  it('update user as admin with long first name', done => {
    agent
      .put(urls.list + '/2')
      .set('authorization', token1)
      .send({
        email: 'user@user.com',
        password: 'password',
        first_name: 'first_name_first_name_first_name_first',
        last_name: 'last_name',
        roles: ['user']
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'status code must be 400');
        done();
      });
  });

  it('update user as admin without last name', done => {
    agent
      .put(urls.list + '/2')
      .set('authorization', token1)
      .send({
        email: 'user@user.com',
        password: 'password',
        first_name: 'first_name',
        roles: ['user']
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'status code must be 400');
        done();
      });
  });

  it('update user as admin with short last name', done => {
    agent
      .put(urls.list + '/2')
      .set('authorization', token1)
      .send({
        email: 'user@user.com',
        password: 'password',
        first_name: 'first_name',
        last_name: 'last',
        roles: ['user']
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'status code must be 400');
        done();
      });
  });

  it('update user as admin with long last name', done => {
    agent
      .put(urls.list + '/2')
      .set('authorization', token1)
      .send({
        email: 'user@user.com',
        password: 'password',
        first_name: 'first_name',
        last_name: 'last_name_last_name_last_name_last',
        roles: ['user']
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'status code must be 400');
        done();
      });
  });

  it('update user as admin with not array roles', done => {
    agent
      .put(urls.list + '/2')
      .set('authorization', token1)
      .send({
        email: 'user@user.com',
        password: 'password',
        first_name: 'first_name',
        last_name: 'last_name',
        roles: 'admin'
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'status code must be 400');
        done();
      });
  });

  it('update user as admin with invalid roles', done => {
    agent
      .put(urls.list + '/2')
      .set('authorization', token1)
      .send({
        email: 'user@user.com',
        password: 'password',
        first_name: 'first_name',
        last_name: 'last_name',
        roles: ['some', 'new']
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'status code must be 400');
        done();
      });
  });

  it('update user as admin without roles', done => {
    agent
      .put(urls.list + '/2')
      .set('authorization', token1)
      .send({
        email: 'user@user.com',
        password: 'password',
        first_name: 'first_name',
        last_name: 'last_name'
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(200, res.statusCode, 'status code must be 200');
        done();
      });
  });

  it('update user as not admin and not owner', done => {
    agent
      .put(urls.list + '/1')
      .set('authorization', token2)
      .send({
        email: 'testuser5@testuser5.com',
        password: 'password',
        first_name: 'first_name',
        last_name: 'last_name'
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(403, res.statusCode, 'status code must be 403');
        done();
      });
  });

  it('update user as not admin and as owner', done => {
    agent
      .put(urls.list + '/2')
      .set('authorization', token2)
      .send({
        email: 'user@user.com',
        password: 'password',
        first_name: 'first_name',
        last_name: 'last_name'
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(200, res.statusCode, 'status code must be 200');
        done();
      });
  });

  it('update user as not admin and as owner with roles', done => {
    agent
      .put(urls.list + '/2')
      .set('authorization', token2)
      .send({
        email: 'user@user.com',
        password: 'password',
        first_name: 'first_name',
        last_name: 'last_name',
        roles: ['admin']
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(200, res.statusCode, 'status code must be 200');
        done();
      });
  });

  it('update user as not admin and as owner with roles', done => {
    agent
      .put(urls.list + '/2')
      .set('authorization', token2)
      .send({
        email: 'user@user.com',
        password: 'password',
        first_name: 'first_name',
        last_name: 'last_name',
        roles: ['admin']
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(200, res.statusCode, 'status code must be 200');
        done();
      });
  });

  it('delete not existing user', done => {
    agent.delete(urls.list + '/100').set('authorization', token1).end((err, res) => {
      assert.equal(null, err);
      assert.equal(404, res.statusCode, 'status code must be 404');
      done();
    });
  });

  it('delete user as user', done => {
    agent.delete(urls.list + '/1').set('authorization', token2).end((err, res) => {
      assert.equal(null, err);
      assert.equal(403, res.statusCode, 'status code must be 403');
      done();
    });
  });

  it('delete user as admin', done => {
    agent.delete(urls.list + '/4').set('authorization', token1).end((err, res) => {
      assert.equal(null, err);
      assert.equal(204, res.statusCode, 'status code must be 204');
      done();
    });
  });
});
