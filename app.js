var express = require('express')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const secret = 'login-regis'

app.use(cors())
app.use(express.json());

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
          res.status(500).json({ status: 'error', message: err });
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
    const token = req.headers.authorization.split(' ')[1];
    var decoded = jwt.verify(token, secret);
    res.json({ status: 'ok', decoded });
  } catch (err) {
    res.json({ status: 'error', message: err.message });
  }
});

app.get('/data', (req, res) => {
  const query = 'SELECT * FROM users'; 

  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Failed to fetch data from database' });
      return;
    }

    res.json(result);
  });
});

app.delete('/delete', (req, res) => {
  const id = req.body.id;
  if (!id) {
    res.status(400).json({ error: 'ID is required in the request body' });
    return;
  }

  const query = 'DELETE FROM users WHERE id = ?'; 
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Failed to delete data from database' });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Data with the specified ID not found' });
    } else {
      res.json({ message: 'Data deleted successfully' });
    }
  });
});

app.get('/data/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM users WHERE id = ?'; 
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Failed to fetch data from database' });
      return;
    }

    if (result.length === 0) {
      res.status(404).json({ error: 'Data with the specified ID not found' });
    } else {
      res.json(result[0]);
    }
  });
});


app.put('/update/:id', (req, res) => {
  
  const id = req.params.id;
  const { firstname, lastname, username, password, career, tel } = req.body; // แทนค่า field1, field2, field3 ด้วยชื่อฟิลด์ที่ต้องการอัปเดต

  if (!id) {
    res.status(400).json({ error: 'ID is required in the request params' });
    return;
  }

  

  const query = 'UPDATE users SET firstname = ?, lastname = ?, username = ?, password = ?, career = ?, tel = ? WHERE id = ?';
  // แก้ไข your_table_name และ field1, field2, field3 เป็นชื่อตารางและฟิลด์ที่ต้องการอัปเดต

  connection.query(query, [firstname, lastname, username, password, career, tel, id], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Failed to update data in database' });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Data with the specified ID not found' });
    } else {
      const selectQuery = 'SELECT * FROM users WHERE id = ?';
      // แก้ไข your_table_name เป็นชื่อตารางที่ต้องการเลือกข้อมูล

      connection.query(selectQuery, [id], (err, rows) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Failed to fetch updated data from database' });
          return;
        }

        if (rows.length === 0) {
          res.status(404).json({ error: 'Data with the specified ID not found' });
        } else {
          res.json({ status: 'ok', message: 'Data updated successfully', data: rows });
        }
      });
    }
  });
});



app.listen(3001, function () {
  console.log('CORS-enabled web server listening on port 3001')
})