let assert = require('assert');
let { tweets } = require('./../app/controllers');
let app = require('./../app');
const agent = require('supertest').agent(app);
const knex = require('../app/libs/knex');
const jwt = require('jsonwebtoken');
const path = require('path');
const env = require('./../app/config');
const fs = require('fs');
const fs_extra = require('fs-extra');

let urls = {
  list: '/api/v1/tweets'
};

let token1 = jwt.sign({ id: 1 }, env.secret, { expiresIn: '120d' });
let token2 = jwt.sign({ id: 2 }, env.secret, { expiresIn: '120d' });
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
            fs_extra.copySync(
              path.join(__dirname, 'artifacts/image_4.png'),
              path.join(__dirname, './../public/upload/image_4.png')
            );
            fs_extra.copySync(
              path.join(__dirname, 'artifacts/image_5.png'),
              path.join(__dirname, './../public/upload/image_5.png')
            );
            fs_extra.copySync(
              path.join(__dirname, 'artifacts/image_6.png'),
              path.join(__dirname, './../public/upload/image_6.png')
            );
            fs_extra.copySync(
              path.join(__dirname, 'artifacts/image_7.png'),
              path.join(__dirname, './../public/upload/image_7.png')
            );
            fs_extra.copySync(
              path.join(__dirname, 'artifacts/image_8.png'),
              path.join(__dirname, './../public/upload/image_8.png')
            );
            fs_extra.copySync(
              path.join(__dirname, 'artifacts/image_9.gif'),
              path.join(__dirname, './../public/upload/image_9.gif')
            );
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
      assert.equal(17, res.body.count, 'count must be 17');
      assert.equal(5, res.body.data.length, 'size of data must be 5');
      assert.equal(200, res.statusCode, 'status code must be 200');
      done();
    });
  });

  it('list all tweets with params', done => {
    agent.get(urls.list + '?limit=7&page=1').set('authorization', token1).end((err, res) => {
      assert.equal(null, err);
      assert.equal(17, res.body.count);
      assert.equal(7, res.body.data.length);
      assert.equal(200, res.statusCode, 'status code must be 200');
      done();
    });
  });

  it('list all tweets without token', done => {
    agent.get(urls.list).end((err, res) => {
      assert.equal(null, err);
      assert.equal(401, res.statusCode, 'status code must be 401');
      done();
    });
  });

  it('list all tweets with short token', done => {
    agent.get(urls.list).set('authorization', 'qwerty_token').end((err, res) => {
      assert.equal(null, err);
      assert.equal(401, res.statusCode, 'status code must be 401');
      done();
    });
  });

  it('list all tweets with invalid token', done => {
    agent.get(urls.list).set('authorization', invalid_token).end((err, res) => {
      assert.equal(null, err);
      assert.equal(401, res.statusCode, 'status code must be 401');
      done();
    });
  });

  it('list all tweets with not existing user', done => {
    agent.get(urls.list).set('authorization', token_not_existing_user).end((err, res) => {
      assert.equal(null, err);
      assert.equal(404, res.statusCode, 'status code must be 404');
      done();
    });
  });

  it('get tweet', done => {
    agent.get(urls.list + '/1').set('authorization', token1).end((err, res) => {
      assert.equal(null, err);
      assert.notEqual(null, res.body, 'body musn`t be null');
      assert.equal(1, res.body.id, 'id must be 1');
      assert.equal(200, res.statusCode, 'status code must be 200');
      done();
    });
  });

  it('get not existing tweet', done => {
    agent.get(urls.list + '/100').set('authorization', token1).end((err, res) => {
      assert.equal(null, err);
      assert.equal(404, res.statusCode, 'status code must be 404');
      done();
    });
  });

  it('add new tweet', done => {
    agent
      .post(urls.list)
      .set('authorization', token1)
      .field('message', "Los Angeles' peoples")
      .attach('image', path.join(__dirname, 'artifacts', 'image_4.png'))
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(201, res.statusCode, 'status code must be 201');
        done();
      });
  });

  it('add new tweet without image', done => {
    agent.post(urls.list).set('authorization', token1).field('message', 'New York news').end((err, res) => {
      assert.equal(null, err);
      assert.equal(201, res.statusCode, 'status code must be 201');
      done();
    });
  });

  it('add new tweet without message', done => {
    agent.post(urls.list).set('authorization', token1).end((err, res) => {
      assert.equal(null, err);
      assert.equal(400, res.statusCode, 'status code must be 400');
      done();
    });
  });

  it('add new tweet with incorrect image type', done => {
    agent
      .post(urls.list)
      .set('authorization', token1)
      .field('message', 'some tweet message')
      .attach('image', path.join(__dirname, 'artifacts', 'image_9.gif'))
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'status code must be 400');
        done();
      });
  });

  it('update tweet', done => {
    agent
      .put(urls.list + '/11')
      .set('authorization', token1)
      .field('message', 'Кращі страви для вас')
      .attach('image', path.join(__dirname, 'artifacts', 'image_5.png'))
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(200, res.statusCode, 'status code must be 200');
        done();
      });
  });

  it('update tweet without image', done => {
    agent
      .put(urls.list + '/11')
      .set('authorization', token1)
      .field('message', 'some updated tweet message without image')
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(200, res.statusCode, 'status code must be 200');
        done();
      });
  });

  it('update tweet without message', done => {
    agent.put(urls.list + '/11').set('authorization', token1).end((err, res) => {
      assert.equal(null, err);
      assert.equal(400, res.statusCode, 'status code must be 400');
      done();
    });
  });

  it('update tweet with invalid type of image', done => {
    agent
      .put(urls.list + '/11')
      .set('authorization', token1)
      .field('message', 'some tweet message')
      .attach('image', path.join(__dirname, 'artifacts', 'image_9.gif'))
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(400, res.statusCode, 'status code must be 400');
        done();
      });
  });

  it('update tweet with invalid tweet id', done => {
    agent
      .put(urls.list + '/100')
      .set('authorization', token1)
      .field('message', 'some update tweet message')
      .attach('image', path.join(__dirname, 'artifacts', 'image_5.png'))
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(403, res.statusCode, 'status code must be 403');
        done();
      });
  });

  it('update tweet with not admin and not owner user', done => {
    agent
      .put(urls.list + '/13')
      .set('authorization', token2)
      .field('message', 'some update tweet message')
      .attach('image', path.join(__dirname, 'artifacts', 'image_5.png'))
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(403, res.statusCode, 'status code must be 403');
        done();
      });
  });

  it('update tweet with not admin and owner user', done => {
    agent
      .put(urls.list + '/12')
      .set('authorization', token2)
      .field('message', 'some update tweet message')
      .attach('image', path.join(__dirname, 'artifacts', 'image_6.png'))
      .end((err, res) => {
        assert.equal(null, err);
        assert.equal(200, res.statusCode, 'status code must be 200');
        done();
      });
  });

  it('delete tweet as admin', done => {
    agent.delete(urls.list + '/16').set('authorization', token1).end((err, res) => {
      assert.equal(null, err);
      assert.equal(204, res.statusCode, 'status code must be 204');
      done();
    });
  });

  it('delete not existing tweet as admin', done => {
    agent.delete(urls.list + '/100').set('authorization', token1).end((err, res) => {
      assert.equal(null, err);
      assert.equal(403, res.statusCode, 'status code must be 403');
      done();
    });
  });

  it('delete tweet as not admin and owner user', done => {
    agent.delete(urls.list + '/12').set('authorization', token2).end((err, res) => {
      assert.equal(null, err);
      assert.equal(204, res.statusCode, 'status code must be 204');
      done();
    });
  });

  it('delete tweet as not admin and not owner user', done => {
    agent.delete(urls.list + '/13').set('authorization', token2).end((err, res) => {
      assert.equal(null, err);
      assert.equal(403, res.statusCode, 'status code must be 403');
      done();
    });
  });

  it('delete admin tweet as user', done => {
    agent.delete(urls.list + '/11').set('authorization', token2).end((err, res) => {
      assert.equal(null, err);
      assert.equal(403, res.statusCode, 'status code must be 403');
      done();
    });
  });

  after(done => {
    if (fs.existsSync(path.join(__dirname, './../public/upload/image_4.png'))) {
      fs.unlinkSync(path.join(__dirname, './../public/upload/image_4.png'));
    }
    if (fs.existsSync(path.join(__dirname, './../public/upload/image_5.png'))) {
      fs.unlinkSync(path.join(__dirname, './../public/upload/image_5.png'));
    }
    if (fs.existsSync(path.join(__dirname, './../public/upload/image_6.png'))) {
      fs.unlinkSync(path.join(__dirname, './../public/upload/image_6.png'));
    }
    if (fs.existsSync(path.join(__dirname, './../public/upload/image_7.png'))) {
      fs.unlinkSync(path.join(__dirname, './../public/upload/image_7.png'));
    }
    if (fs.existsSync(path.join(__dirname, './../public/upload/image_8.png'))) {
      fs.unlinkSync(path.join(__dirname, './../public/upload/image_8.png'));
    }
    if (fs.existsSync(path.join(__dirname, './../public/upload/image_9.gif'))) {
      fs.unlinkSync(path.join(__dirname, './../public/upload/image_9.gif'));
    }
    done();
  });
});
