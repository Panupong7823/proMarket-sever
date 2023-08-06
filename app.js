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
      'INSERT INTO users(cs_id,username,password,firstname,lastname,career,tel,row) VALUES (?,?,?,?,?,?,?,?)',
      [req.body.cs_id,req.body.username, hash, req.body.firstname, req.body.lastname, req.body.career, req.body.tel, req.body.row],
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
              row: users[0].row,
              user_id: users[0].cs_id
              
            },
            secret,
            { expiresIn: '1h' }
          );
          // ตรงนี้ส่งค่า row ของผู้ใช้ไปด้วย
          res.json({ status: 'ok', message: 'login success', token, user: users[0].row });
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

// // Middleware สำหรับการแปลง JSON ที่ส่งมาใน request
// app.use(bodyParser.json());

// // Middleware สำหรับตรวจสอบ Token และเอาข้อมูลผู้ใช้งาน
// function verifyToken(req, res, next) {
//   const token = req.headers['authorization'];

//   if (!token) {
//     return res.status(403).json({ message: 'Missing token' });
//   }

//   jwt.verify(token, secret, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: 'Invalid token' });
//     }

//     // เก็บข้อมูลผู้ใช้งานใน req.user หรือในส่วนอื่น ๆ ตามที่คุณต้องการ
//     req.user = decoded;
//     next();
//   });
// }

// // Middleware สำหรับดึงข้อมูลผู้ใช้งานจาก Token
// function getUserDetail(req, res, next) {
//   const token = req.headers['authorization'];

//   jwt.verify(token, secret, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: 'Invalid token' });
//     }

//     const username = decoded.username;
//     const sql = 'SELECT * FROM users WHERE username = ?';

//     connection.query(sql, [username], (err, result) => {
//       if (err) {
//         console.error('Error executing query:', err);
//         return res.status(500).json({ message: 'Error fetching user data' });
//       }

//       if (result.length === 0) {
//         return res.status(404).json({ message: 'User not found' });
//       }

//       const user = result[0];
//       req.userDetail = user;
//       next();
//     });
//   });
// }

// // API เพื่อดึงข้อมูลผู้ใช้งานด้วย Token
// app.get('/api/user', verifyToken, getUserDetail, (req, res) => {
//   res.json(req.userDetail);
// });



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

// API สำหรับดึงข้อมูลตารางจากฐานข้อมูล
app.get('/datatotalt/:userId', (req, res) => {
  const {userId} = req.params;

  const sql = `
  SELECT
    balance.cs_id,
    balance.ba_id,
    balance.stale,
    revenue.re_id,
    revenue.payout,
    aggregate.total
  FROM
    balance
  LEFT JOIN
    revenue ON balance.cs_id = revenue.cs_id
  LEFT JOIN
    aggregate ON balance.cs_id = aggregate.cs_id
  WHERE
    balance.cs_id = ?
`;

connection.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ message: 'Error fetching amount data' });
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

  

  const query = 'UPDATE users SET firstname = ?, lastname = ?, username = ?, password = ?, career = ?, tel = ?, cs_id = ? WHERE id = ?';
  // แก้ไข your_table_name และ field1, field2, field3 เป็นชื่อตารางและฟิลด์ที่ต้องการอัปเดต

  connection.query(query, [firstname, lastname, username, password, career, tel, id ,cs_id], (err, result) => {
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



// var express = require('express')
// var cors = require('cors')
// var app = express()
// var bodyParser = require('body-parser')
// var jsonParser = bodyParser.json()
// const bcrypt = require('bcrypt');
// const saltRounds = 10;
// var jwt = require('jsonwebtoken');
// const secret = 'login-regis'

// app.use(cors())
// app.use(express.json());

// const mysql = require('mysql2');
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   database: 'test'
// });

// app.post('/regis', jsonParser, function (req, res, next) {
//     bcrypt.hash(req.body.cs_password, saltRounds, function (err, hash) {
//       if (err) {
//         res.status(500).json({ status: 'error', message: err });
//         return;
//       }

//       // เริ่มต้นด้วยการเพิ่มบัญชีในตาราง 'user' และจัดเก็บ password ที่เข้ารหัสแล้ว
//       connection.query(
//         'INSERT INTO user (u_id, u_name, u_password,u_role) VALUES (?, ?, ?, ?)',
//         [req.body.u_id, req.body.u_name, hash,req.body.role],
//         function (err, userResult, fields) {
//           if (err) {
//             res.status(500).json({ status: 'error', message: err });
//             return;
//           }

//           // เมื่อสร้างบัญชีในตาราง 'user' เสร็จแล้ว จึงทำการเพิ่มข้อมูลในตาราง 'customer'
//           connection.query(
//             'INSERT INTO customer (cs_id, cs_fname, cs_lname, cs_nname, cs_career, cs_tel, cs_saraly, u_id) VALUES (?,?,?,?,?,?,?,?)',
//             [req.body.cs_id, req.body.cs_fname, req.body.cs_lname, req.body.cs_nname, req.body.cs_career, req.body.cs_tel, req.body.cs_saraly, req.body.u_id],
//             function (err, results, fields) {
//               if (err) {
//                 res.status(500).json({ status: 'error', message: err });
//                 return;
//               }
//               res.json({ status: 'ok' });
//             }
//           );
//         }
//       );
//     });
// });

// app.post('/login', jsonParser, function (req, res, next) {
//     connection.query(
//       'SELECT * FROM user WHERE u_name=?',
//       [req.body.u_name],
//       function (err, users, fields) {
//         if (err) {
//           res.json({ status: 'error', message: err });
//           return;
//         }
//         if (users.length == 0) {
//           res.json({ status: 'error', message: 'user not found' });
//           return;
//         }

//         bcrypt.compare(req.body.password, users[0].u_password, function (err, Login) {
//           if (Login) {
//             connection.query(
//               'SELECT * FROM customer WHERE u_id=?',
//               [users[0].u_id],
//               function (err, customer, fields) {
//                 if (err) {
//                   res.json({ status: 'error', message: err });
//                   return;
//                 }

//                 var token = jwt.sign(
//                   { 
//                     username: users[0].u_name,
//                     row: users[0].u_role,
//                     customerData: customer[0] // ข้อมูลจากตาราง customer
//                   },
//                   secret,
//                   { expiresIn: '1h' }
//                 );

//                 res.json({ status: 'ok', message: 'login success', token, user: users[0].u_role, customer });
//               }
//             );
//           } else {
//             res.json({ status: 'error', message: 'login failed' });
//           }
//         });
        
//       }
//     );
//   });

  
// app.listen(3002, function () {
//     console.log('CORS-enabled web server listening on port 3002')
//   })