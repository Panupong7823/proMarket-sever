CREATE DATABASE subsomboon;
USE subsomboon;

CREATE TABLE users ( 
    cs_id varchar(10),
    firstname varchar(50),
    lastname varchar(50),
    username varchar(50),
    password varchar(100),
    career varchar(50),
    tel varchar(50),
    salary int(10),
    role int(10),
    PRIMARY KEY (cs_id)
);

INSERT INTO `users` (`id`, `cs_id`, `firstname`, `lastname`, `username`, `password`, `career`, `tel`, `role`, `salary`) VALUES
(1, 'a101', 'Zlen', 'Colony', 'zlencol', '$2b$10$c2ajSYCwxQvx8984I6ZcF.u7jj.zhXbVnD26/RMRmRl.ptSSz.dly', 'Admin', '0952725151', 2, NULL),
(29, 'a102', 'May', 'Miz', 'maymiz', '$2b$10$bLMpGDsHp2HcizwLmByi1uzhh0fzh94HMT2pQfcoiGIhyYRKDB.K6', 'Admin', '0952347879', 2, NULL),
(9, 'A103', 'Lalisa', 'Sulaiman', '1', '$2b$10$dcJZ.eg48ABGJTsiRYaWRuvhYMJEdTyZts6N6uDswOD//IANGjexm', 'polit', '0923456789', 3, 3500),
(10, 'A104', 'อานนท์', 'ปานประกอบ', 'Arnon', '$2b$10$AOtDXoqhx9RnnxRrZLJOcusjAUHVHQVl.kI/ulYxPaozpf6FGKD92', 'polit', '0923456781', 3, 23000),
(11, 'A105', 'พชรี', 'เกียรติโกศล', 'Pachcharee', '$2b$10$IALX4QIpuqP3DAlojPA7zuknKLT6UGHL1SSdGZG7F5uBx3SpnU7km', 'polit', '0923236789', 3, 4000),
(12, 'A106', 'ธานนท์', 'ธนากร', 'Tanon', '$2b$10$HdQLKO05Zwd5Nk3j.8pb0e.ljBhD2BbXxqkl0EUSC0LDWslk.IPCq', 'Polit', '0923456123', 3, 6500),
(13, 'A107', 'พร้อมพงศ์', 'เรืองฤทิธิ์', 'Prompong', '$2b$10$ggZz2.5ctKGAknpvt2B9S.qj011pB5crqVbZDcvAUxpyBbr5a5tgO', 'Polit', '0923236567', 3, 45600),
(18, 'A108', 'อารัญญา', 'เจริญผล', 'Arrunya', '$2b$10$B9OdeCRM0chhHfD0sCNrCub5Z3IxuMYNhVJ/XMNI6Je/IrX09wLZy', 'Polit', '0913236686', 3, 8000),
(20, 'A109', 'ตุลย์', 'รัตนกิจสกุล', 'Tul', '$2b$10$YQ4FUM.VGD67JjtOUczmBel57XxAGM.Gb3An/2sZdyHG0mcSYaNmG', 'polit', '0923236111', 3, 13000),
(21, 'A110', 'พรรษา', 'สว่างวิทยา', 'Punsa', '$2b$10$f7G26zJkLX9LW97/bKiELeeEU4kkAfyK74N0916fY0XHpFTz85Wu2', 'Polit', '0952347879', 3, 45000),
(35, 'A111', 'ดาริน', 'รดา', 'RinradaR', '$2b$10$YDRt.1sMxHc2F7pT/bOululnWf.iljZBqvnzkDknqruSYTp0d6Hsy', 'Polit', '0923233456', 3, 20000),
(26, 'A112', 'อารีรัตน์', 'อโยริน', 'zlencol', '$2b$10$L9Q3tEYsVXkaJg76ujzNa.P1fSN./RmI6XWNB5Y9NCue4Y8X0JYWS', 'pirot', '0947372777', 3, 25000),
(38, 'A113', 'ดาเรศ', 'รดา', 'DarasR', '$2b$10$IdyDJ2HI03dpyFMcctte8OJ.6nPTC4Qi61IscRF.v8HeQdlWbmdKO', 'Polit', '0923233456', 3, 20000),
(39, 'A114', 'อามี', 'สว่างวิทยา', 'ArmeeS', '$2b$10$WldDmbMtpiGPdAk5nvdD9.NTykhKHW8JGNjNVVbqe42J53TLBn92e', 'Polit', '0952347879', 3, 20000),
(27, 'A115', 'ดาริน', 'หมีขาว', 'Col', '$2b$10$tzlixQxF4CbmEe0r8qwF5eiDhFqEVQ8J3CyBW9DzZRnh1iPgqI0oe', 'Polite', '0923456789', 3, 20000),
(44, 'O997', 'ผักกาด', 'กินแล้วดี', 'mayowner', '$2b$10$dwxHg.UI7MxV8Q0OwdcqgeybS7FiA0Ye.D.pIehfIJGF4Z.I.ySR6', 'Owner', '0952347879', 1, NULL),
(32, 'O999', 'Pin', 'Jaa', 'pin', '$2b$10$aXo4aubvAB8SOwg3xGei/.PvtYSp3nwIp5Jei6OmFIj2NPmZEGpqy', 'owner', '0895555555', 1, NULL);

--

CREATE TABLE balancess (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cs_id varchar(10),
    date_time DATETIME,
    amount int(10),
    status varchar(10),
    FOREIGN KEY (cs_id) REFERENCES users(cs_id) ON UPDATE CASCADE ON DELETE CASCADE
);
INSERT INTO `balancess` (`id`, `cs_id`, `date_time`, `amount`, `status`) VALUES
(1, 'A104', '2023-08-09 01:29:34', 10000, '1'),
(2, 'A104', '2023-08-09 01:30:00', 1000, '1'),
(3, 'A104', '2023-08-09 01:30:15', 200, '2'),
(4, 'A105', '2023-08-09 01:31:39', 400, '1'),
(26, 'A104', '2023-08-09 15:32:46', 400, '1'),
(27, 'A105', '2023-08-09 17:30:55', 40, '1'),
(28, 'A106', '2023-08-09 17:31:52', 50, '1'),
(29, 'A108', '2023-08-09 17:32:25', 200, '1'),
(30, 'A107', '2023-08-09 17:32:55', 120, '1'),
(31, 'A109', '2023-08-09 17:33:13', 40, '1'),
(32, 'A109', '2023-08-09 17:34:54', 25, '1'),
(33, 'A103', '2023-08-09 17:36:33', 250, '1'),
(34, 'A102', '2023-08-09 17:36:52', 150, '1'),
(35, 'A101', '2023-08-09 17:37:13', 450, '1'),
(36, 'A102', '2023-08-09 17:37:29', 20, '1'),
(37, 'A104', '2023-08-09 17:51:05', 200, '1'),
(38, 'A107', '2023-08-09 17:51:15', 200, '1'),
(39, 'A104', '2023-08-09 17:51:34', 200, '2'),
(40, 'A101', '2023-08-09 17:52:07', 200, '2'),
(41, 'A106', '2023-08-09 17:52:53', 300, '1'),
(42, 'A105', '2023-08-09 17:53:08', 300, '1'),
(43, 'A103', '2023-08-09 17:53:45', 560, '1'),
(44, 'A104', '2023-08-09 17:54:05', 758, '1'),
(45, 'A103', '2023-08-09 17:54:24', 879, '1'),
(46, 'A108', '2023-08-09 17:54:53', 800, '1'),
(47, 'A107', '2023-08-09 17:55:15', 456, '1'),
(48, 'A103', '2023-08-09 17:55:37', 400, '2'),
(49, 'A108', '2023-08-09 17:56:05', 20, '1'),
(50, 'A103', '2023-08-09 17:56:54', 300, '1'),
(51, 'A106', '2023-08-09 17:57:29', 350, '1'),
(52, 'A111', '2023-08-09 17:58:42', 400, '1'),
(53, 'A112', '2023-08-09 17:58:56', 470, '1'),
(54, 'A113', '2023-08-09 17:59:14', 850, '1'),
(55, 'A115', '2023-08-09 17:59:31', 250, '1'),
(56, 'A114', '2023-08-09 17:59:58', 400, '1'),
(57, 'A114', '2023-08-09 18:00:17', 40, '1'),
(58, 'A112', '2023-08-09 18:00:36', 300, '2'),
(59, 'A110', '2023-08-09 18:01:34', 400, '1'),
(60, 'A107', '2023-08-10 03:15:51', 800, '1'),
(61, 'A107', '2023-08-10 03:17:04', 300, '2'),
(62, 'A107', '2023-08-10 14:57:21', 1400, '1');



CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role INT NOT NULL 
);

CREATE TABLE customer (
    cs_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    em_id INT,
    firstname varchar(50),
    lastname varchar(50),
    career varchar(50),
    tel varchar(50),
    salary int(10),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE admin(
    ad_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
CREATE TABLE owner(
    ow_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);


