CREATE DATABASE supsomboon;
USE supsomboon;


CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role INT NOT NULL
);

INSERT INTO users (username, password, role) VALUES ('Guest', '$2b$10$B.UpubBeGY8S3pDEj5ZCkunIwhod7dyWpec2Oy1bL.i2lUs1b/kmS', 2);

CREATE TABLE customer (
    cs_id varchar(10) PRIMARY KEY,
    user_id INT,
    firstname varchar(50),
    lastname varchar(50),
    career varchar(50),
    tel varchar(50),
    salary int(10),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE admin (
    ad_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

INSERT INTO admin (user_id, firstname, lastname) VALUES (1, 'Guest', 'Guest');

CREATE TABLE owner(
    ow_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  message TEXT
);
INSERT INTO `messages` (`id`, `message`) VALUES
(1, 'กรุณาชำระเงินทั้งหมดไม่เกินวันที่ 25 ของทุกเดือน \nหากเกินกำหนด จะขอยุติการจำหน่ายสินค้าจนกว่าจะชำระเงินเรียบร้อย ');


