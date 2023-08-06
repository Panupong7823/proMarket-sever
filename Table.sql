CREATE TABLE user (
    u_id int(100),
    u_name varchar(30),
    u_password varchar(30),
    u_role varchar(30),
    PRIMARY KEY (u_id)
);

CREATE TABLE owner ( 
    ow_id varchar(10),
    ow_fname varchar(50),
    ow_lname varchar(50),
    ow_uname varchar(30),
    ow_pasword varchar(30),
    u_id int(10),
    PRIMARY KEY (ow_id), 
    FOREIGN KEY (u_id) REFERENCES user(u_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE admin ( 
    ad_id varchar(10),
    ad_fname varchar(50),
    ad_lname varchar(50),
    ad_uname varchar(30),
    ad_pasword varchar(30),
    u_id int(10),
    PRIMARY KEY (ad_id), 
    FOREIGN KEY (u_id) REFERENCES user(u_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE customer ( 
    cs_id varchar(10),
    cs_fname varchar(50),
    cs_lname varchar(50),
    cs_nname varchar(10),
    cs_uname varchar(30),
    cs_pasword varchar(30),
    cs_career varchar(50),
    cs_tel varchar(50),
    cs_saraly int(10),
    u_id int(10),
    PRIMARY KEY (cs_id), 
    FOREIGN KEY (u_id) REFERENCES user(u_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE balance ( 
    ba_id varchar(10),
    stale int(10),
    date_time DATETIME,
    cs_id varchar(10),
    PRIMARY KEY (ba_id), 
    FOREIGN KEY (cs_id) REFERENCES customer(cs_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE revenue ( 
    re_id varchar(10),
    payout int(10),
    date_time DATETIME,
    cs_id varchar(10),
    PRIMARY KEY (re_id), 
    FOREIGN KEY (cs_id) REFERENCES customer(cs_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE aggregate ( 
    re_id varchar(10),
    ba_id varchar(10),
    total int(10),
    cs_id varchar(10),
    PRIMARY KEY (re_id), 
    FOREIGN KEY (cs_id) REFERENCES customer(cs_id) ON UPDATE CASCADE ON DELETE CASCADE
);

SELECT balance.ba_id, balance.cs_id, balance.stale - COALESCE(revenue.payout, 0) AS total
FROM balance
LEFT JOIN revenue ON balance.cs_id = revenue.cs_id
