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
      'INSERT INTO users(cs_id,username,password,firstname,lastname,career,tel,role) VALUES (?,?,?,?,?,?,?,3)',
      [req.body.cs_id, req.body.username, hash, req.body.firstname, req.body.lastname, req.body.career, req.body.tel, req.body.role],
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
        res.json({ status: 'error', message: err });
        return;
      }
      if (users.length === 0) {
        res.json({ status: 'error', message: 'user not found' });
        return;
      }

      bcrypt.compare(req.body.password, users[0].password, function (err, Login) {
        if (err) {
          res.json({ status: 'error', message: 'login failed' });
          return;
        }

        if (Login) {
          var token = jwt.sign(
            {
              firstname: users[0].firstname,
              lastname: users[0].lastname,
              username: users[0].username,
              role: users[0].role,
              user_id: users[0].cs_id

            },
            secret,
            { expiresIn: '1h' }
          );
          // ตรงนี้ส่งค่า role ของผู้ใช้ไปด้วย
          res.json({ status: 'ok', message: 'login success', token, user: users[0].role });
        } else {
          res.json({ status: 'error', message: 'login failed' });
        }
      });
    }
  );
});


app.post('/auth', jsonParser, function (req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    var decoded = jwt.verify(token, secret);
    res.json({ status: 'ok', decoded });
  } catch (err) {
    res.json({ status: 'error', message: err.message });
  }
});


//ใช้ดึงข้อมูลส่วนตัวทั้งหมด
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
//ใช้ดึงข้อมูลยอดค้างทั้งหมด
app.get('/databalance', (req, res) => {
  const query = `
  SELECT cs_id, date_time,stale, 0 AS payout, 0 AS total
  FROM balance
  
  UNION ALL
  SELECT r.cs_id, r.date_time, 0 AS stale, r.payout, a.total
  FROM revenue r
  JOIN (
      SELECT cs_id, total
      FROM aggregate
  ) a ON r.cs_id = a.cs_id;`;

  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Failed to fetch data from database' });
      return;
    }

    res.json(result);
  });
});

// Middleware สำหรับตรวจสอบ Token และเอาข้อมูลผู้ใช้งาน
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Missing token' });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decoded;
    next();
  });
}

// Middleware สำหรับดึงข้อมูลผู้ใช้งานจากฐานข้อมูล
function getUserDetail(req, res, next) {
  const sql = 'SELECT * FROM users WHERE username = ?';
  pool.query(sql, [req.user.username], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ message: 'Error fetching user data' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.userDetail = result[0];
    next();
  });
}

//ใช้ในการดึงข้อมูลตารางยอดรวม
app.get('/datatotalt/:userId', (req, res) => {
  const { userId } = req.params;

  const sql = `
  SELECT cs_id, date_time, stale, 0 AS payout, 0 AS total
FROM balance 
WHERE cs_id = ?

UNION ALL

SELECT r.cs_id, r.date_time, 0 AS stale, r.payout, a.total
FROM revenue r
JOIN (
    SELECT cs_id, total
    FROM aggregate
) a ON r.cs_id = a.cs_id
WHERE r.cs_id = ?;

`;


  connection.query(sql, [userId,userId], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ message: 'Error fetching amount data' });
    }

    res.json(result);
  });
});

app.get('/datauser/:userId', (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT * FROM users WHERE cs_id = ?;
  `;

  connection.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ message: 'Error fetching user data' });
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

    if (result.affectedRoles === 0) {
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
  const { firstname, lastname, username, password, career, tel, cs_id } = req.body;

  // แฮชรหัสผ่านก่อนบันทึกลงในฐานข้อมูล
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      res.status(500).json({ error: 'Failed to hash password' });
      return;
    }

    // เมื่อแฮชรหัสผ่านสำเร็จ คุณสามารถอัปเดตข้อมูลในฐานข้อมูลได้
    const query = 'UPDATE users SET firstname = ?, lastname = ?, username = ?, password = ?, career = ?, tel = ?, cs_id = ? WHERE id = ?';
    connection.query(query, [firstname, lastname, username, hashedPassword, career, tel, cs_id, id], (err, result) => {
      // ข้อผิดพลาดในการคิวรีฐานข้อมูล
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Failed to update data in database' });
        return;
      }

      // ไม่พบข้อมูลที่ต้องการอัปเดต
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Data with the specified ID not found' });
      } else {
        // อัปเดตสำเร็จ
        const selectQuery = 'SELECT * FROM users WHERE id = ?';
        connection.query(selectQuery, [id], (err, role) => {
          if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Failed to fetch updated data from database' });
            return;
          }

          // ส่งข้อมูลที่อัปเดตสำเร็จกลับไป
          res.json({ status: 'ok', message: 'Data updated successfully', data: role });
        });
      }
    });
  });
});





app.listen(3001, function () {
  console.log('CORS-enabled web server listening on port 3001')
})
