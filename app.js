var express = require('express')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const bcrypt = require('bcrypt');
const saltRounds = 5;
var jwt = require('jsonwebtoken');
const secret = 'login-regis'

app.use(cors())

const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'subsomboon'
});

app.post('/regis', jsonParser, function (req, res, next) {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    connection.query(
      'INSERT INTO users(username,password,firstname,lastname,career,tel) VALUES (?,?,?,?,?,?)',
      [req.body.username, hash, req.body.firstname, req.body.lastname, req.body.career, req.body.tel],
      function (err, results, fields) {
        if (err) {
          res.json({ status: 'error', message: err })
          return
        }
        res.json({ status: 'ok' })
      }
    );
  });
})

app.post('/login', jsonParser, function (req, res, next) {
  connection.query(
    'SELECT * FROM users WHERE username=?',
    [req.body.username],
    function (err, users, fields) {
      if (err) {
        res.json({ status: 'error', message: err })
        return
      }
      if (users.length == 0) {
        res.json({ status: 'error', message: 'user not found' })
        return
      }
      bcrypt.compare(req.body.password, users[0].password, function (err, Login) {
        if (Login) {
          var token = jwt.sign({ username: users[0].username }, secret, { expiresIn: '1h' });
          res.json({ status: 'ok', message: 'login succes', token })
        } else {
          res.json({ status: 'error', message: 'login failed' })
        }
      });
    }
  );
})

app.post('/auth', jsonParser, function (req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1]
    var decoded = jwt.verify(token, secret);
    res.json({ status:'ok',decoded })
  } catch (err) {
    res.json({ status:'error',massage:err.message})
  }
})

app.listen(3001, function () {
  console.log('CORS-enabled web server listening on port 3001')
})