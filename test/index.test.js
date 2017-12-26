var request = require('supertest');
var assert = require('assert');
var app = require('../src/app');
var mysql = require('mysql');
var basic = require('../src/db/basic');

var cb = require('../src/operation/cb').cb;

var cookies;

describe('页面url测试', function () {
  it('get /', function (done) {
    request(app)
      .get('/')
      .expect(200, function (err, res) {
        assert((res.text).indexOf('-欢迎页面') !== -1);
        done();
      });
  });
  it('get /main', function (done) {
    request(app)
      .get('/main')
      .expect(200, function (err, res) {
        assert((res.text).indexOf('-主页') !== -1);
        done();
      });
  });
  it('get /user/login', function (done) {
    request(app)
      .get('/user/login')
      .expect(200, function (err, res) {
        assert((res.text).indexOf('-登录页面') !== -1);
        done();
      });
  });
  it('get /user/register', function (done) {
    request(app)
      .get('/user/register')
      .expect(200, function (err, res) {
        assert((res.text).indexOf('-注册页面') !== -1);
        done();
      });
  });
  it('get /user/logout', function (done) {
    request(app)
      .get('/user/logout')
      .expect(200, function (err, res) {
        assert((res.text).indexOf('Found. Redirecting to /') !== -1);
        done();
      });
  });
  it('get /mail', function (done) {
    request(app)
      .get('/mail')
      .expect(200, function (err, res) {
        assert((res.text).indexOf('-邮件列表页面') !== -1);
        done();
      });
  });
  it('get /mail/send', function (done) {
    request(app)
      .get('/mail/send')
      .expect(200, function (err, res) {
        assert((res.text).indexOf('-发送邮件页面') !== -1);
        done();
      });
  });
  it('get /mail/1', function (done) {
    request(app)
      .get('/mail/1')
      .expect(200, function (err, res) {
        assert((res.text).indexOf('-邮件信息页面') !== -1);
        done();
      });
  });
  it('get /mail/wwww', function (done) {
    request(app)
      .get('/mail/wwww')
      .expect(200, function (err, res) {
        assert((res.text).indexOf('404') !== -1);
        done();
      });
  });
});

describe('数据库链接测试', function () {
  before(function (done) {
    // 创建数据库
    var con = mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD
    });
    con.query('DROP DATABASE dmail', function () {
      con.query('CREATE DATABASE dmail', function () {
        con.end();
        done();
      });
    });
  });
  it('connect to mysql', function (done) {
    basic(function (con) {
      assert(con);
      con.end();
      done();
    });
  });
  it('connect to dmail', function (done) {
    basic(function (con) {
      assert(con);
      con.end();
      done();
    }, 'dmail');
  });
});
//用户api测试
describe('POST /users', function () {
  before(function (done) {
    // 链接数据库
    var con = mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: 'dmail'
    });
    con.connect(function (err) {
      if (err) throw err;
      var sql = 'CREATE TABLE user (id INT NOT NULL AUTO_INCREMENT,username VARCHAR(20) NOT NULL,password VARCHAR(64) NOT NULL,createdAt DATETIME,PRIMARY KEY ( id ))';
      con.query(sql, function (err) {
        if (err) throw err;
        sql = 'CREATE TABLE user_mailbox (id INT NOT NULL AUTO_INCREMENT,user int NOT NULL,mailbox int NOT NULL,createdAt DATETIME,PRIMARY KEY ( id ))';
        con.query(sql, function (err) {
          if (err) throw err;
          sql = 'CREATE TABLE mailbox (id INT NOT NULL AUTO_INCREMENT,address VARCHAR(20) NOT NULL,createdAt DATETIME,PRIMARY KEY ( id ))';
          con.query(sql, function (err) {
            if (err) throw err;
            sql = 'CREATE TABLE receivered_mail (id INT NOT NULL AUTO_INCREMENT,mailbox int NOT NULL,mail int NOT NULL,createdAt DATETIME,PRIMARY KEY ( id ))';
            con.query(sql, function (err) {
              if (err) throw err;
              sql = 'CREATE TABLE mail (id INT NOT NULL AUTO_INCREMENT,sender VARCHAR(20) NOT NULL, receiver VARCHAR(20) NOT NULL, title VARCHAR(20) NOT NULL, content VARCHAR(250) NOT NULL, date VARCHAR(20) NOT NULL, state int NOT NULL DEFAULT 0,createdAt DATETIME,PRIMARY KEY ( id ))';
              con.query(sql, function (err) {
                if (err) throw err;
                con.end();
                done();
              });
            });
          });
        });
      });
    });
  });
  it('注册测试', function (done) {
    request(app)
      .post('/users/register')
      .type('json')
      .send({
        'username': 'root',
        'password': '123',
        'sub': '注册'
      })
      .set('Accept', 'application/json')
      .expect(200, done);
  });
  it('重复注册测试', function (done) {
    request(app)
      .post('/users/register')
      .type('json')
      .send({
        'username': 'root',
        'password': '123',
        'sub': '注册'
      })
      .set('Accept', 'application/json')
      .expect(200, done);
  });
  it('登录测试', function (done) {
    request(app)
      .post('/users/login')
      .type('json')
      .send({
        'username': 'root',
        'password': '123',
        'sub': '登录'
      })
      .expect(200, function (err, res) {
        cookies = res.headers['set-cookie'];
        done();
      });
  });
  it('发送邮件测试', function (done) {
    var date = new Date().toLocaleString();
    var req = request(app)
      .post('/mails/send')
      .type('json')
      .send({
        'title': 'test',
        'address': 'root@dmail.com',
        'content': '**********',
        'date': date
      })
      .set('Accept', 'application/json');
    req.cookies = cookies;
    req.expect(200, done);
  });
  it('发送邮件测试', function (done) {
    var date = new Date().toLocaleString();
    var req = request(app)
      .post('/mails/send')
      .type('json')
      .send({
        'title': 'test',
        'address': 'r',
        'content': '**********',
        'date': date
      })
      .set('Accept', 'application/json');
    req.cookies = cookies;
    req.expect(200, done);
  });
  it('获取邮件列表测试', function (done) {
    var req = request(app)
      .get('/mails')
      .set('Accept', 'application/json');
    // .expect('Content-Type', /json/)
    req.cookies = cookies;
    req.expect(200, done);
  });
  it('显示邮件测试', function (done) {
    var req = request(app)
      .post('/mails/1')
      .type('json')
      .send({
        id: 1,
        sender: 'root',
        receiver: 'root@dmail.com',
        title: 'test',
        state: '',
        content: '**********',
        date: '2017-12-11 19:11:03',
        createdAt: null
      })
      .set('Accept', 'application/json');
    req.cookies = cookies;
    req.expect(200, done);
  });
  it('登录失败测试', function (done) {
    request(app)
      .post('/users/login')
      .type('json')
      .send({
        'username': 'root',
        'password': '1234',
        'sub': '登录'
      })
      .set('Accept', 'application/json')
      .expect(200, done);
  });
});
describe('回调函数测试', function () {
  it('should test error', function () {
    let func = cb();
    assert(!func(new Error('Test Error')));
    assert(!func(true));
  });
});