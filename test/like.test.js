let assert = require('assert');
let { likes } = require('./../app/controllers');
let app = require('./../app');
const agent = require('supertest').agent(app);
const knex = require('../app/libs/knex');
const jwt = require('jsonwebtoken');
const env = require('./../app/config');

let urls = {
  list: '/api/v1/likes'
};

let token1 = jwt.sign({ id: 1 }, env.secret, { expiresIn: '120d' });

describe('likes tests', () => {
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

  it('add like', done => {
    agent.post(urls.list).set('authorization', token1).send({ tweet_id: 2 }).end((err, res) => {
      assert.equal(null, err);
      assert.equal(201, res.statusCode, 'status code must be 201');
      done();
    });
  });

  it('add existing like', done => {
    agent.post(urls.list).set('authorization', token1).send({ tweet_id: 1 }).end((err, res) => {
      assert.equal(null, err);
      assert.equal(409, res.statusCode, 'status code must be 409');
      done();
    });
  });

  it('add like without token', done => {
    agent.post(urls.list).send({ tweet_id: 3 }).end((err, res) => {
      assert.equal(null, err);
      assert.equal(401, res.statusCode, 'status code must be 401');
      done();
    });
  });

  it('add like without tweet id', done => {
    agent.post(urls.list).set('authorization', token1).end((err, res) => {
      assert.equal(null, err);
      assert.equal(400, res.statusCode, 'status code must be 400');
      done();
    });
  });

  it('add like with invalid tweet id', done => {
    agent.post(urls.list).set('authorization', token1).send({ tweet_id: 100 }).end((err, res) => {
      assert.equal(null, err);
      assert.equal(400, res.statusCode, 'status code must be 400');
      done();
    });
  });

  it('delete like', done => {
    agent.delete(urls.list).set('authorization', token1).send({ tweet_id: 4 }).end((err, res) => {
      assert.equal(null, err);
      assert.equal(204, res.statusCode, 'status code must be 204');
      done();
    });
  });

  it('delete not existing like', done => {
    agent.delete(urls.list).set('authorization', token1).send({ tweet_id: 6 }).end((err, res) => {
      assert.equal(null, err);
      assert.equal(404, res.statusCode, 'status code must be 404');
      done();
    });
  });

  it('delete like without tweet id', done => {
    agent.delete(urls.list).set('authorization', token1).end((err, res) => {
      assert.equal(null, err);
      assert.equal(400, res.statusCode, 'status code must be 400');
      done();
    });
  });
});
