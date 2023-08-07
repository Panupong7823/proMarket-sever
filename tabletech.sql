CREATE TABLE users ( 
    cs_id varchar(10),
    firstname varchar(50),
    lastname varchar(50),
    username varchar(50),
    password varchar(30),
    career varchar(50),
    tel varchar(50),
    role int(10),
    PRIMARY KEY (cs_id)
);


CREATE TABLE balance ( 
    ba_id varchar(10),
    stale int(10),
    date_time DATETIME,
    cs_id varchar(10),
    PRIMARY KEY (ba_id), 
    FOREIGN KEY (cs_id) REFERENCES users(cs_id) ON UPDATE CASCADE ON DELETE CASCADE
);


CREATE TABLE revenue ( 
    re_id varchar(10),
    payout int(10),
    date_time DATETIME,
    cs_id varchar(10),
    PRIMARY KEY (re_id), 
    FOREIGN KEY (cs_id) REFERENCES users(cs_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE aggregate (
    ba_id varchar(10),
    re_id varchar(10),
    cs_id varchar(10),
    total DECIMAL(10, 2),
    PRIMARY KEY (ba_id, re_id, cs_id),
    FOREIGN KEY (cs_id) REFERENCES users(cs_id) ON UPDATE CASCADE ON DELETE CASCADE
);

INSERT INTO aggregate (ba_id, re_id, cs_id, total)
SELECT balance.ba_id, revenue.re_id, balance.cs_id, balance.stale - COALESCE(revenue.payout, 0) AS total
FROM balance
LEFT JOIN revenue ON balance.ba_id = revenue.re_id;
