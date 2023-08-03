CREATE TABLE User_type (
    u_id varchar(10),
    u_name varchar(30),
    u_pasword varchar(30),
    u_type char(1),
    PRIMARY KEY (u_id)
);

CREATE TABLE Users (
    
    User_id int(5) ,
    Utype_id char(5),
    User_fname varchar(50),
    User_lname varchar(50),
    User_tel varchar(50),
    User_add varchar(100),
    User_email varchar(50),
    User_user varchar(50),
    User_pass varchar(200),
    PRIMARY KEY (User_id), 
    FOREIGN KEY (Utype_id) REFERENCES User_type(Utype_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE Table_status (    
    Status_id int(5),
    Status_name varchar(20),
    PRIMARY KEY (Status_id)
);

CREATE TABLE Tables (
    Status_id int(5),    
    t_id int(5),
    t_seat int(10),
    PRIMARY KEY (t_id), 
    FOREIGN KEY (Status_id) REFERENCES Table_status(Status_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE Orders (
    t_id int(5),
    o_id int(10),
    o_date date,
    tatal_price float(50),
    o_plate float(50),
    PRIMARY KEY (o_id),
    FOREIGN KEY (t_id) REFERENCES Tables(t_id) ON UPDATE CASCADE ON DELETE CASCADE

);

CREATE TABLE Menu(
    m_id int(10),
    m_name varchar(50),
    m_details varchar(50),
    m_price int(50),
    m_img varchar(50),
    PRIMARY KEY (m_id)
);

CREATE TABLE Bill(
    b_id int(10),
    o_id int(10),
    User_id int(5),
    total_price int(10),
   
    
    PRIMARY KEY (b_id),
    FOREIGN KEY(o_id) REFERENCES Orders(o_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(User_id) REFERENCES Users(User_id) ON UPDATE CASCADE ON DELETE CASCADE
);


CREATE TABLE Detail_order(
    d_id int(10),
    m_id int(10),
    o_id int(10),
    d_plates varchar(50),
    Price float(50),
    d_status varchar(50),
    PRIMARY KEY (d_id),
    FOREIGN KEY (m_id) REFERENCES Menu(m_id)  ON UPDATE CASCADE ON DELETE CASCADE

);

