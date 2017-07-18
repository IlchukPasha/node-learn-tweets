let assert = require('assert');
let { auth } = require('./../app/controllers');
let app = require('./../app');
const agent = require('supertest').agent(app);
const knex = require('../app/libs/knex');

describe('auth tests', () => {
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

  it('signup', done => {
    agent
      .post('/api/v1/signup')
      .send({
        email: 'some_test_user@test.com',
        password: 'password',
        first_name: 'test_first_name',
        last_name: 'test_last_name'
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(201, res.statusCode, 'not correct status code');
        assert.notEqual(null, res.body.token, 'empty token');
        done();
      });
  });

  it('signup without email', done => {
    agent
      .post('/api/v1/signup')
      .send({
        password: 'password',
        first_name: 'test_first_name',
        last_name: 'test_last_name'
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'not correct status code');
        done();
      });
  });

  it('signup with not correct email', done => {
    agent
      .post('/api/v1/signup')
      .send({
        email: 'email',
        password: 'password',
        first_name: 'test_first_name',
        last_name: 'test_last_name'
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'not correct status code');
        done();
      });
  });

  it('signup with not unique email', done => {
    agent
      .post('/api/v1/signup')
      .send({
        email: 'some_test_user@test.com',
        password: 'password',
        first_name: 'test_first_name',
        last_name: 'test_last_name'
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'not correct status code');
        done();
      });
  });

  it('signup without password', done => {
    agent
      .post('/api/v1/signup')
      .send({
        email: 'some_test_new_user@test.com',
        first_name: 'test_first_name',
        last_name: 'test_last_name'
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'not correct status code');
        done();
      });
  });

  it('signup with password less then 5', done => {
    agent
      .post('/api/v1/signup')
      .send({
        email: 'some_test_new_user@test.com',
        password: 'pass',
        first_name: 'test_first_name',
        last_name: 'test_last_name'
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'not correct status code');
        done();
      });
  });

  it('signup without first name', done => {
    agent
      .post('/api/v1/signup')
      .send({
        email: 'some_test_new_user@test.com',
        password: 'password',
        last_name: 'test_last_name'
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'not correct status code');
        done();
      });
  });

  it('signup with first name less then 5', done => {
    agent
      .post('/api/v1/signup')
      .send({
        email: 'some_test_new_user@test.com',
        password: 'password',
        first_name: 'test',
        last_name: 'test_last_name'
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'not correct status code');
        done();
      });
  });

  it('signup with first name greater then 30', done => {
    agent
      .post('/api/v1/signup')
      .send({
        email: 'some_test_new_user@test.com',
        password: 'password',
        first_name: 'testtesttesttesttesttesttesttest',
        last_name: 'test_last_name'
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'not correct status code');
        done();
      });
  });

  it('signup without last name', done => {
    agent
      .post('/api/v1/signup')
      .send({
        email: 'some_test_new_user@test.com',
        password: 'password',
        first_name: 'test_first_name'
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'not correct status code');
        done();
      });
  });

  it('signup with last name less then 5', done => {
    agent
      .post('/api/v1/signup')
      .send({
        email: 'some_test_new_user@test.com',
        password: 'password',
        first_name: 'test_first_name',
        last_name: 'test'
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'not correct status code');
        done();
      });
  });

  it('signup with last name greater then 30', done => {
    agent
      .post('/api/v1/signup')
      .send({
        email: 'some_test_new_user@test.com',
        password: 'password',
        first_name: 'test_first_name',
        last_name: 'testtesttesttesttesttesttesttest'
      })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'not correct status code');
        done();
      });
  });

  it('signin', done => {
    agent.post('/api/v1/signin').send({ email: 'some_test_user@test.com', password: 'password' }).end((err, res) => {
      assert.equal(null, err);
      assert.equal(200, res.statusCode);
      assert.notEqual(null, res.body.token, 'empty token');
      done();
    });
  });

  it('signin with email that not exist', done => {
    agent.post('/api/v1/signin').send({ email: 'notexist@test.com', password: 'password' }).end((err, res) => {
      assert.equal(null, err);
      assert.equal(401, res.statusCode);
      done();
    });
  });

  it('signin with incorrect password', done => {
    agent
      .post('/api/v1/signin')
      .send({ email: 'some_test_user@test.com', password: 'some password' })
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(401, res.statusCode);
        done();
      });
  });

  it('signin without email', done => {
    agent.post('/api/v1/signin').send({ password: 'password' }).end((err, res) => {
      assert.equal(null, err);
      assert.equal(400, res.statusCode);
      done();
    });
  });

  it('signin with invalid email', done => {
    agent.post('/api/v1/signin').send({ email: 'email', password: 'password' }).end((err, res) => {
      assert.equal(null, err);
      assert.equal(400, res.statusCode);
      done();
    });
  });

  it('signin without password', done => {
    agent.post('/api/v1/signin').send({ email: 'some_test_user@test.com' }).end((err, res) => {
      assert.equal(null, err);
      assert.equal(400, res.statusCode);
      done();
    });
  });

  it('signin with password less then 5', done => {
    agent.post('/api/v1/signin').send({ email: 'some_test_user@test.com', password: 'pass' }).end((err, res) => {
      assert.equal(null, err);
      assert.equal(400, res.statusCode);
      done();
    });
  });
});
