let assert = require('assert');
let { tweets } = require('./../app/controllers');
let app = require('./../app');
const agent = require('supertest').agent(app);
const knex = require('../app/libs/knex');
const jwt = require('jsonwebtoken');
const env = require('./../app/config');

let urls = {
  list: '/api/v1/tweets',
  get: '/api/v1/tweets/',
  post: '/api/v1/tweets'
};

let token1 = jwt.sign({ id: 1 }, env.secret, { expiresIn: '120d' });
let invalid_token = jwt.sign({ id: 1 }, 'invalid_secret', { expiresIn: '120d' });
let token_not_existing_user = jwt.sign({ id: 10 }, env.secret, { expiresIn: '120d' });

describe('tweets tests', () => {
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

  it('list all tweets without params', done => {
    agent.get(urls.list).set('authorization', token1).end((err, res) => {
      assert.equal(null, err);
      assert.equal(10, res.body.count);
      assert.equal(5, res.body.data.length);
      assert.equal(200, res.statusCode, 'not correct status code');
      done();
    });
  });

  it('list all tweets with params', done => {
    agent.get(urls.list + '?limit=7&page=1').set('authorization', token1).end((err, res) => {
      assert.equal(null, err);
      assert.equal(10, res.body.count);
      assert.equal(7, res.body.data.length);
      assert.equal(200, res.statusCode, 'not correct status code');
      done();
    });
  });

  it('list all tweets without token', done => {
    agent.get(urls.list).end((err, res) => {
      assert.equal(null, err);
      assert.equal(401, res.statusCode, 'not correct status code');
      done();
    });
  });

  it('list all tweets with short token', done => {
    agent.get(urls.list).set('authorization', 'qwerty_token').end((err, res) => {
      assert.equal(null, err);
      assert.equal(401, res.statusCode, 'not correct status code');
      done();
    });
  });

  it('list all tweets with invalid token', done => {
    agent.get(urls.list).set('authorization', invalid_token).end((err, res) => {
      assert.equal(null, err);
      assert.equal(401, res.statusCode, 'not correct status code');
      done();
    });
  });

  it('list all tweets with not existing user', done => {
    agent.get(urls.list).set('authorization', token_not_existing_user).end((err, res) => {
      assert.equal(null, err);
      assert.equal(404, res.statusCode, 'not correct status code');
      done();
    });
  });

  it('get tweet', done => {
    agent.get(urls.get + '1').set('authorization', token1).end((err, res) => {
      assert.equal(null, err);
      assert.notEqual(null, res.body);
      assert.equal(1, res.body.id);
      assert.equal(200, res.statusCode, 'not correct status code');
      done();
    });
  });

  it('get not existing tweet', done => {
    agent.get(urls.get + '100').set('authorization', token1).end((err, res) => {
      assert.equal(null, err);
      assert.equal(404, res.statusCode, 'not correct status code');
      done();
    });
  });
});
