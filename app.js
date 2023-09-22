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
  password: '1234',
  database: 'testproject'
});

const payload = {
  username: 'win',
  role: 1,
  cs_id: 'your-cs-id-value', // เพิ่ม cs_id ลงใน payload ตามต้องการ
  iat: Math.floor(Date.now() / 1000), // หากต้องการกำหนด iat แบบแน่นอน
  exp: Math.floor(Date.now() / 1000) + 3600, // หากต้องการกำหนด exp แบบแน่นอน
};

// สร้าง Token
const token = jwt.sign(payload, secret);


//ใส่ข้อมูลส่วนตัวลูกค้า
app.post('/regis', jsonParser, function (req, res, next) {
  connection.query(
    'SELECT username FROM users WHERE username = ?',
    [req.body.username],
    function (err, results, fields) {
      if (err) {
        res.status(500).json({ status: 'error', message: err });
        return;
      }

      if (results.length > 0) {
        res.status(400).json({ status: 'error', message: 'Username already exists' });
        return;
      }

      bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        connection.query(
          'INSERT INTO users(username, password, role) VALUES (?,?,1)',
          [req.body.username, hash],
          function (err, results, fields) {
            if (err) {
              res.status(500).json({ status: 'error', message: err });
              return;
            }
            const user_id = results.insertId;
            connection.query(
              'INSERT INTO customer(user_id, cs_id, firstname, lastname, career, tel, salary) VALUES (?,?,?,?,?,?,?)',
              [user_id, req.body.cs_id, req.body.firstname, req.body.lastname, req.body.career, req.body.tel, req.body.salary],
              function (err, results, fields) {
                if (err) {
                  res.status(500).json({ status: 'error', message: err });
                  return;
                }
                res.json({ status: 'ok' });
              }
            );
          }
        );
      });
    }
  );
});

//ใส่ข้อมูลส่วนตัวadmin
app.post('/regisAd', jsonParser, function (req, res, next) {
  connection.query(
    'SELECT username FROM users WHERE username = ?',
    [req.body.username],
    function (err, results, fields) {
      if (err) {
        res.status(500).json({ status: 'error', message: err });
        return;
      }

      if (results.length > 0) {
        res.status(400).json({ status: 'error', message: 'Username already exists' });
        return;
      }
      bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        connection.query(
          'INSERT INTO users(username, password, role) VALUES (?, ?, 2)',
          [req.body.username, hash],
          function (err, results, fields) {
            if (err) {
              res.status(500).json({ status: 'error', message: err });
              return;
            }
            const user_id = results.insertId;

            connection.query(
              'INSERT INTO admin(user_id, firstname, lastname) VALUES (?, ?, ?)',
              [user_id, req.body.firstname, req.body.lastname],
              function (err, results, fields) {
                if (err) {
                  res.status(500).json({ status: 'error', message: err });
                  return;
                }
                res.json({ status: 'ok' });
              }
            );
          }
        );
      });
    }
  )
});

//ใส่ข้อมูลส่วนตัว owner
app.post('/regisOw', jsonParser, function (req, res, next) {
  connection.query(
    'SELECT username FROM users WHERE username = ?',
    [req.body.username],
    function (err, results, fields) {
      if (err) {
        res.status(500).json({ status: 'error', message: err });
        return;
      }

      if (results.length > 0) {
        res.status(400).json({ status: 'error', message: 'Username already exists' });
        return;
      }
      bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        connection.query(
          'INSERT INTO users(username, password, role) VALUES (?,?,3)',
          [req.body.username, hash, req.body.role],
          function (err, results, fields) {
            if (err) {
              res.status(500).json({ status: 'error', message: err });
              return;
            }
            const user_id = results.insertId;
            connection.query(
              'INSERT INTO owner(user_id, firstname, lastname) VALUES (?,?,?)',
              [user_id, req.body.firstname, req.body.lastname],
              function (err, results, fields) {
                if (err) {
                  res.status(500).json({ status: 'error', message: err });
                  return;
                }
                res.json({ status: 'ok' });
              }
            );
          }
        );
      });
    })
});

//ใส่ข้อมูลบัญชี
app.post('/regisBl', jsonParser, function (req, res, next) {


  connection.query(
    'INSERT INTO balancess (cs_id,date_time,status,amount) VALUES (?,NOW(),?,?)',
    [req.body.cs_id, req.body.status, req.body.amount],
    function (err, results, fields) {
      if (err) {
        res.status(500).json({ status: 'error', message: err });
        return
      }
      res.json({ status: 'ok' })
    }
  );
});


app.post('/login', jsonParser, function (req, res, next) {
  connection.query(
    'SELECT * FROM users u LEFT JOIN customer c ON u.user_id = c.user_id WHERE u.username=?',
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
              user_id: users[0].user_id,
              cs_id: users[0].cs_id,
            },
            secret,
            { expiresIn: '1h' }
          );
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
  const query = `
    SELECT customer.*
    FROM customer
    INNER JOIN users ON customer.user_id = users.user_id
    WHERE users.role = 1
  `;

  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Failed to fetch data from database' });
      return;
    }

    res.json(result);
  });
});

//ใช้ดึงข้อมูลส่วนตัวของadmin
app.get('/dataAd', (req, res) => {
  const query = `
    SELECT admin.*
    FROM admin
    INNER JOIN users ON admin.user_id = users.user_id
    WHERE users.role = 2
`;

  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Failed to fetch data from database' });
      return;
    }
    res.json(result);
  });
});
//ใช้ดึงข้อมูลส่วนตัวของowner
app.get('/dataOw', (req, res) => {
  const query = `
    SELECT owner.*
    FROM owner
    INNER JOIN users ON owner.user_id = users.user_id
    WHERE users.role = 3
`;

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
app.get('/databalances', (req, res) => {
  const databl = `
    SELECT
    id,
    cs_id,
    date_time,
    amount,
    status,
    CASE
      WHEN status = 1 THEN 'stale'
      WHEN status = 2 THEN 'pay'
    END AS status_description
    FROM balancess;
  `;

  const datatl = `
    SELECT
    b.cs_id,
      SUM(CASE WHEN b.status = 1 THEN b.amount ELSE 0 END) AS stale_total,
      SUM(CASE WHEN b.status = 2 THEN b.amount ELSE 0 END) AS pay_total,
      SUM(CASE WHEN b.status = 1 THEN b.amount ELSE 0 END) - SUM(CASE WHEN b.status = 2 THEN b.amount ELSE 0 END) AS total
    FROM
      balancess b
    GROUP BY
      b.cs_id;
  `;

  connection.query(databl, (err, resultbl) => {
    if (err) {
      console.error('Error executing query 1:', err);
      res.status(500).json({ error: 'Failed to fetch data from database' });
      return;
    }

    connection.query(datatl, (err, resultl) => {
      if (err) {
        console.error('Error executing datatotal:', err);
        res.status(500).json({ error: 'Failed to fetch data from database' });
        return;
      }

      const responseData = {
        databalanceResult: resultbl,
        datatotalResult: resultl
      };

      res.json(responseData);
    });
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

  const databl = `
    SELECT
      id,
      cs_id,
      date_time,
      amount,
      status,
      CASE
        WHEN status = 1 THEN 'stale'
        WHEN status = 2 THEN 'pay'
      END AS status_description
    FROM balancess
    WHERE cs_id = ?;
  `;

  connection.query(databl, [userId], (datablErr, datablResult) => {
    if (datablErr) {
      console.error('Error executing databl query:', datablErr);
      return res.status(500).json({ message: 'Error fetching data from balancess' });
    }
    res.json({
      databl: datablResult,
    });
  });
});
//ใช้ในการดึงข้อมูลตารางยอดรวม
app.get('/datatotaltl/:userId', (req, res) => {
  const { userId } = req.params;


  const datatl = `
    SELECT
      b.cs_id,
      SUM(CASE WHEN b.status = 1 THEN b.amount ELSE 0 END) AS stale_total,
      SUM(CASE WHEN b.status = 2 THEN b.amount ELSE 0 END) AS pay_total,
      SUM(CASE WHEN b.status = 1 THEN b.amount ELSE 0 END) - SUM(CASE WHEN b.status = 2 THEN b.amount ELSE 0 END) AS total
    FROM
      balancess b
    WHERE
      b.cs_id = ?
    GROUP BY
      b.cs_id;
  `;

  connection.query(datatl, [userId], (datatlErr, datatlResult) => {
    if (datatlErr) {
      console.error('Error executing datatl query:', datatlErr);
      return res.status(500).json({ message: 'Error fetching data from aggregate' });
    }

    res.json({
      datatl: datatlResult
    });
  });
});
app.get('/datauser/:csId', (req, res) => {
  const { csId } = req.params;

  const sql = `
    SELECT users.*, customer.*
    FROM users
    INNER JOIN customer ON users.user_id = customer.user_id
    WHERE customer.cs_id = ?;
  `;

  connection.query(sql, [csId], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ message: 'Error fetching user data' });
    }

    res.json(result);
  });
});


app.delete('/delete', (req, res) => {
  const user_id = req.body.user_id;
  if (!user_id) {
    res.status(400).json({ error: 'ID is required in the request body' });
    return;
  }

  const deleteCustomerQuery = 'DELETE FROM customer WHERE user_id = ?';
  connection.query(deleteCustomerQuery, [user_id], (err, customerResult) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Failed to delete data from customer table' });
      return;
    }

    const deleteAdminQuery = 'DELETE FROM admin WHERE user_id = ?';
    connection.query(deleteAdminQuery, [user_id], (err, adminResult) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Failed to delete data from admin table' });
        return;
      }

      const deleteOwnerQuery = 'DELETE FROM owner WHERE user_id = ?';
      connection.query(deleteOwnerQuery, [user_id], (err, ownerResult) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Failed to delete data from owner table' });
          return;
        }

        const deleteUserQuery = 'DELETE FROM users WHERE user_id = ?';
        connection.query(deleteUserQuery, [user_id], (err, userResult) => {
          if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Failed to delete data from users table' });
            return;
          }

          if (userResult.affectedRows === 0) {
            res.status(404).json({ error: 'Data with the specified ID not found' });
          } else {
            res.json({ message: 'Data deleted successfully' });
          }
        });
      });
    });
  });
});

//ค่อยแก้
app.get('/data/:id', (req, res) => {
  const id = req.params.id;

  const query = `
    SELECT u.username, u.password, c.firstname, c.lastname, c.cs_id, c.career, c.tel, c.salary, a.firstname AS admin_firstname, a.lastname AS admin_lastname, o.firstname AS owner_firstname, o.lastname AS owner_lastname
    FROM users u
    LEFT JOIN customer c ON u.user_id = c.user_id
    LEFT JOIN admin a ON u.user_id = a.user_id
    LEFT JOIN owner o ON u.user_id = o.user_id
    WHERE u.user_id = ?
  `;

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Failed to fetch data from database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Data with the specified ID not found' });
    } else {
      const userData = results[0];
      res.json(userData);
    }
  });
});

//หน้าแก้ไขผู้ใช้ (แก้ไขรหัสลูกค้าไม่ได้)
app.put('/update/:id', (req, res) => {
  const id = req.params.id;
  const { username, password, cs_id, firstname, lastname, career, tel, salary } = req.body;

  // ตรวจสอบว่ามีการส่ง password มาหรือไม่
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  // ดึงข้อมูลผู้ใช้จากฐานข้อมูลเพื่อตรวจสอบรหัสผ่านเดิม
  const selectQuery = 'SELECT password FROM users WHERE user_id = ?';
  connection.query(selectQuery, [id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Failed to fetch user data from database' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User with the specified ID not found' });
    }

    const existingPassword = results[0].password;

    // ตรวจสอบว่ารหัสผ่านที่ส่งมาเหมือนกับรหัสผ่านเดิมหรือไม่
    if (password === existingPassword) {
      // รหัสผ่านเหมือนกัน ไม่ต้อง hash รหัสผ่านใหม่
      updateDataWithoutPassword();
    } else {
      // รหัสผ่านไม่เหมือน ต้อง hash รหัสผ่านใหม่
      bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
          console.error('Error hashing password:', err);
          return res.status(500).json({ error: 'Failed to hash password' });
        }

        updateDataWithNewPassword(hashedPassword);
      });
    }
  });

  // ฟังก์ชันสำหรับอัปเดตข้อมูลโดยไม่ต้อง hash รหัสผ่านใหม่
  function updateDataWithoutPassword() {
    // ใช้ INNER JOIN เพื่อรวมข้อมูลจาก users และ customer โดยใช้ user_id เป็นตัวเชื่อม
    const query = `
      UPDATE users u
      INNER JOIN customer c ON u.user_id = c.user_id
      SET u.username = ?, c.cs_id = ?, c.firstname = ?, c.lastname = ?, c.career = ?, c.tel = ?, c.salary = ?
      WHERE u.user_id = ?
    `;

    connection.query(query, [username, cs_id, firstname, lastname, career, tel, salary, id], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Failed to update data in database' });
      }

      // ไม่พบข้อมูลที่ต้องการอัปเดต
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Data with the specified ID not found' });
      }

      // อัปเดตสำเร็จ
      const selectQuery = 'SELECT * FROM users u INNER JOIN customer c ON u.user_id = c.user_id WHERE u.user_id = ?';
      connection.query(selectQuery, [id], (err, updatedData) => {
        if (err) {
          console.error('Error executing query:', err);
          return res.status(500).json({ error: 'Failed to fetch updated data from database' });
        }

        // ส่งข้อมูลที่อัปเดตสำเร็จกลับไป
        res.json({ status: 'ok', message: 'Data updated successfully', data: updatedData });
      });
    });
  }

  // ฟังก์ชันสำหรับอัปเดตข้อมูลโดย hash รหัสผ่านใหม่
  function updateDataWithNewPassword(newHashedPassword) {
    // ใช้ INNER JOIN เพื่อรวมข้อมูลจาก users และ customer โดยใช้ user_id เป็นตัวเชื่อม
    const query = `
      UPDATE users u
      INNER JOIN customer c ON u.user_id = c.user_id
      SET u.username = ?, u.password = ?, c.cs_id = ?, c.firstname = ?, c.lastname = ?, c.career = ?, c.tel = ?, c.salary = ?
      WHERE u.user_id = ?
    `;

    connection.query(query, [username, newHashedPassword, cs_id, firstname, lastname, career, tel, salary, id], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Failed to update data in database' });
      }

      // ไม่พบข้อมูลที่ต้องการอัปเดต
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Data with the specified ID not found' });
      }

      // อัปเดตสำเร็จ
      const selectQuery = 'SELECT * FROM users u INNER JOIN customer c ON u.user_id = c.user_id WHERE u.user_id = ?';
      connection.query(selectQuery, [id], (err, updatedData) => {
        if (err) {
          console.error('Error executing query:', err);
          return res.status(500).json({ error: 'Failed to fetch updated data from database' });
        }

        // ส่งข้อมูลที่อัปเดตสำเร็จกลับไป
        res.json({ status: 'ok', message: 'Data updated successfully', data: updatedData });
      });
    });
  }
});

app.put('/update/admin/:id', (req, res) => {
  const id = req.params.id;
  const { username, password, ad_id, firstname, lastname } = req.body;

  // ตรวจสอบว่ามีการส่ง password มาหรือไม่
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  // ดึงข้อมูลผู้ใช้จากฐานข้อมูลเพื่อตรวจสอบรหัสผ่านเดิม
  const selectQuery = 'SELECT password FROM users WHERE user_id = ?';
  connection.query(selectQuery, [id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Failed to fetch user data from database' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User with the specified ID not found' });
    }

    const existingPassword = results[0].password;

    // ตรวจสอบว่ารหัสผ่านที่ส่งมาเหมือนกับรหัสผ่านเดิมหรือไม่
    if (password === existingPassword) {
      // รหัสผ่านเหมือนกัน ไม่ต้อง hash รหัสผ่านใหม่
      updateDataWithoutPassword();
    } else {
      // รหัสผ่านไม่เหมือน ต้อง hash รหัสผ่านใหม่
      bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
          console.error('Error hashing password:', err);
          return res.status(500).json({ error: 'Failed to hash password' });
        }

        updateDataWithNewPassword(hashedPassword);
      });
    }
  });

  // ฟังก์ชันสำหรับอัปเดตข้อมูลโดยไม่ต้อง hash รหัสผ่านใหม่
  function updateDataWithoutPassword() {
    // ใช้ INNER JOIN เพื่อรวมข้อมูลจาก users และ admin โดยใช้ user_id เป็นตัวเชื่อม
    const query = `
      UPDATE users u
      INNER JOIN admin a ON u.user_id = a.user_id
      SET u.username = ?, a.firstname = ?, a.lastname = ?
      WHERE u.user_id = ?
    `;

    connection.query(query, [username, firstname, lastname, id], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Failed to update data in database' });
      }

      // ไม่พบข้อมูลที่ต้องการอัปเดต
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Data with the specified ID not found' });
      }

      // อัปเดตสำเร็จ
      const selectQuery = 'SELECT * FROM users u INNER JOIN admin a ON u.user_id = a.user_id WHERE u.user_id = ?';
      connection.query(selectQuery, [id], (err, updatedData) => {
        if (err) {
          console.error('Error executing query:', err);
          return res.status(500).json({ error: 'Failed to fetch updated data from database' });
        }

        // ส่งข้อมูลที่อัปเดตสำเร็จกลับไป
        res.json({ status: 'ok', message: 'Data updated successfully', data: updatedData });
      });
    });
  }

  // ฟังก์ชันสำหรับอัปเดตข้อมูลโดย hash รหัสผ่านใหม่
  function updateDataWithNewPassword(newHashedPassword) {
    // ใช้ INNER JOIN เพื่อรวมข้อมูลจาก users และ admin โดยใช้ user_id เป็นตัวเชื่อม
    const query = `
      UPDATE users u
      INNER JOIN admin a ON u.user_id = a.user_id
      SET u.username = ?, u.password = ?, a.firstname = ?, a.lastname = ?
      WHERE u.user_id = ?
    `;

    connection.query(query, [username, newHashedPassword, firstname, lastname, id], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Failed to update data in database' });
      }

      // ไม่พบข้อมูลที่ต้องการอัปเดต
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Data with the specified ID not found' });
      }

      // อัปเดตสำเร็จ
      const selectQuery = 'SELECT * FROM users u INNER JOIN admin a ON u.user_id = a.user_id WHERE u.user_id = ?';
      connection.query(selectQuery, [id], (err, updatedData) => {
        if (err) {
          console.error('Error executing query:', err);
          return res.status(500).json({ error: 'Failed to fetch updated data from database' });
        }

        // ส่งข้อมูลที่อัปเดตสำเร็จกลับไป
        res.json({ status: 'ok', message: 'Data updated successfully', data: updatedData });
      });
    });
  }
});



app.put('/update/owner/:id', (req, res) => {
  const id = req.params.id;
  const { username, password, ow_id, firstname, lastname } = req.body;

  // ตรวจสอบว่ามีการส่ง password มาหรือไม่
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      return res.status(500).json({ error: 'Failed to hash password' });
    }

    // ใช้ INNER JOIN เพื่อรวมข้อมูลจาก users และ admin โดยใช้ user_id เป็นตัวเชื่อม
    const query = `
      UPDATE users u
      INNER JOIN owner o ON o.user_id = a.user_id
      SET o.username = ?, o.password = ?, o.firstname = ?, o.lastname = ?
      WHERE u.user_id = ?
    `;

    connection.query(query, [username, hashedPassword, firstname, lastname, id], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Failed to update data in database' });
      }

      // ไม่พบข้อมูลที่ต้องการอัปเดต
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Data with the specified ID not found' });
      }

      // อัปเดตสำเร็จ
      const selectQuery = 'SELECT * FROM users u INNER JOIN owner o ON u.user_id = o.user_id WHERE u.user_id = ?';
      connection.query(selectQuery, [id], (err, updatedData) => {
        if (err) {
          console.error('Error executing query:', err);
          return res.status(500).json({ error: 'Failed to fetch updated data from database' });
        }
        

        // ส่งข้อมูลที่อัปเดตสำเร็จกลับไป
        res.json({ status: 'ok', message: 'Data updated successfully', data: updatedData });
      });
    });
  });
});


//หน้าแก้ไขยอด
app.put('/updatestale/:id', (req, res) => {
  const id = req.params.id;
  const { amount } = req.body;

  const query = 'UPDATE balancess SET amount = ? WHERE id = ?';
  connection.query(query, [amount, id], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Failed to update data in database' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Data with the specified ID not found' });
    } else {
      const selectQuery = 'SELECT * FROM balancess WHERE id = ?';
      connection.query(selectQuery, [id], (err, role) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Failed to fetch updated data from database' });
          return;
        }
        res.json({ status: 'ok', message: 'Data updated successfully', data: role });
      });
    }
  });
});

app.get('/datastale/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM balancess WHERE id = ?';
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

app.delete('/deletebl', (req, res) => {
  const id = req.body.id;

  if (!id) {
    res.status(400).json({ error: 'ID is required in the request body' });
    return;
  }

  const query = 'DELETE FROM balancess WHERE id = ?';
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

app.get('/message', (req, res) => {
  const query = 'SELECT message FROM messages WHERE id = 1';
  connection.query(query, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (rows.length > 0) {
        const message = rows[0].message;
        res.json({ message });
      } else {
        res.status(404).json({ error: 'Message not found' });
      }
    }
  });
});


app.put('/message', (req, res) => {
  const { newMessage } = req.body;
  const query = 'UPDATE messages SET message = ? WHERE id = 1';

  connection.query(query, [newMessage], (err, result) => {

    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json({ message: newMessage });
    }
  });
});

app.listen(3001, function () {
  console.log('CORS-enabled web server listening on port 3001')
})
