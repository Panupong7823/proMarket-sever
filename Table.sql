-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Sep 22, 2023 at 02:32 PM
-- Server version: 8.1.0
-- PHP Version: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `testproject`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `ad_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `firstname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `lastname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`ad_id`, `user_id`, `firstname`, `lastname`) VALUES
(1, 4, 'Zlen', 'Colony');

-- --------------------------------------------------------

--
-- Table structure for table `balancess`
--

CREATE TABLE `balancess` (
  `id` int NOT NULL,
  `cs_id` varchar(10) DEFAULT NULL,
  `date_time` datetime DEFAULT NULL,
  `amount` int DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `total` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `balancess`
--

INSERT INTO `balancess` (`id`, `cs_id`, `date_time`, `amount`, `status`, `total`) VALUES
(3, 'A104', '2023-09-13 21:54:11', 10000, '1', 0),
(7, 'A104', '2023-09-13 22:33:07', 400, '1', NULL),
(11, 'A104', '2023-09-13 22:41:51', 40, '1', NULL),
(13, 'A104', '2023-09-13 22:44:56', 300, '2', NULL),
(14, 'A104', '2023-09-13 22:45:56', 40, '2', NULL),
(15, 'A104', '2023-09-13 22:47:58', 132, '2', NULL),
(17, 'A104', '2023-09-13 23:01:12', 300, '2', NULL),
(20, 'A104', '2023-09-13 23:10:23', 122, '2', NULL),
(21, 'A104', '2023-09-13 23:13:29', 123, '1', NULL),
(23, 'A104', '2023-09-13 23:32:41', 100, '1', NULL),
(24, 'A104', '2023-09-13 23:33:10', 591, '1', NULL),
(25, 'A104', '2023-09-13 23:38:54', 100, '2', NULL),
(26, 'A104', '2023-09-13 23:42:11', 122, '2', NULL),
(27, 'A104', '2023-09-13 23:43:18', 300, '1', NULL),
(28, 'A104', '2023-09-13 23:44:58', 12, '2', NULL),
(29, 'A104', '2023-09-15 15:46:09', 200, '1', NULL),
(30, 'A104', '2023-09-15 15:47:13', 300, '1', NULL),
(31, 'A104', '2023-09-15 15:48:37', 300, '1', NULL),
(32, 'A107', '2023-09-15 15:52:25', 300, '2', NULL),
(33, 'A104', '2023-09-16 07:10:31', 300, '2', NULL),
(34, 'A107', '2023-09-16 07:17:44', 300, '2', NULL),
(35, 'A104', '2023-09-16 07:22:16', 1000, '2', NULL),
(36, 'A104', '2023-09-21 14:20:42', 300, '2', NULL),
(37, 'A104', '2023-09-21 14:21:28', 200, '2', NULL),
(43, 'A107', '2023-09-21 14:37:38', 4500, '1', NULL),
(44, 'A104', '2023-09-22 10:43:03', 400, '1', NULL),
(45, 'A104', '2023-09-22 10:43:22', 1000, '1', NULL),
(46, 'A107', '2023-09-22 12:03:07', 400, '1', NULL),
(47, 'A107', '2023-09-22 12:05:30', 6000, '1', NULL),
(48, 'A107', '2023-09-22 12:10:22', 100, '1', NULL),
(49, 'A107', '2023-09-22 12:32:12', 5000, '1', NULL),
(50, 'A107', '2023-09-22 12:32:40', 5000, '1', NULL),
(51, 'A104', '2023-09-22 12:46:35', 100, '1', NULL),
(52, 'A104', '2023-09-22 12:46:57', 200, '1', NULL),
(53, 'A104', '2023-09-22 12:51:06', 250, '2', NULL),
(54, 'A107', '2023-09-22 12:51:20', 5000, '2', NULL),
(55, 'A107', '2023-09-22 12:56:55', 400, '1', NULL),
(56, 'A107', '2023-09-22 12:57:26', 4200, '1', NULL),
(57, 'A107', '2023-09-22 12:58:11', 1, '2', NULL),
(58, 'A107', '2023-09-22 12:58:31', 1, '1', NULL),
(59, 'A107', '2023-09-22 12:58:50', 23, '2', NULL),
(60, 'A104', '2023-09-22 12:59:11', 800, '2', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `cs_id` varchar(10) NOT NULL,
  `user_id` int DEFAULT NULL,
  `firstname` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) DEFAULT NULL,
  `career` varchar(50) DEFAULT NULL,
  `tel` varchar(50) DEFAULT NULL,
  `salary` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`cs_id`, `user_id`, `firstname`, `lastname`, `career`, `tel`, `salary`) VALUES
('A101', 24, 'sa', 'nysa', 'wer', '012324324', 20000),
('A104', 9, 'win', 'ny', 'pirot', '12324324', 10000),
('A105', 13, 'winny', 'solide', 'pirot', '12324324', 10000),
('A107', 14, 'น้องเมย์จ้าา', 'อยากนอนแล้ว', 'Polit', '0123456789', 20000),
('A108', 18, 'sa', 'nysa', 'Polit', '012324324', 4000),
('A111', 17, 'ดาริน', 'รดา', 'Doctor', '0923233456', 20000),
('A112', 22, 'พรรษา', 'สว่างวิทยา', 'wer', '0952347879', 25000),
('A113', 23, 'sa', 'nysa', 'Admin', '012324324', 25000);

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int NOT NULL,
  `message` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `message`) VALUES
(1, 'กรุณาชำระเงินทั้งหมดไม่เกินวันที่ 25 ของทุกเดือน \nหากเกินกำหนด จะขอยุติการจำหน่ายสินค้าจนกว่าจะชำระเงินเรียบร้อย ');

-- --------------------------------------------------------

--
-- Table structure for table `owner`
--

CREATE TABLE `owner` (
  `ow_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `firstname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `lastname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `owner`
--

INSERT INTO `owner` (`ow_id`, `user_id`, `firstname`, `lastname`) VALUES
(5, 10, 'Pin', 'hahahao');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `role`) VALUES
(4, 'zlencol', '$2b$10$LO97trFvvzGtY/YVgaMQy.xy4z.zI5BbyRrGG3Rsx7RSN1kxlww2C', 2),
(9, 'win', '$2b$10$7o2ZLOx0hIJUxgRAVhDXLuYiPy3GUKopu2iRS/FqII9kI/KQCVSYa', 1),
(10, 'pin', '$2b$10$z.YS7WAof3DmRvzlOX6Cte52xzVOURKF8Vl1gzh990qW28LeharWW', 3),
(12, 'maymiz', '$2b$10$TIBpbMxiznfZ3rb17H58Me4pHdwgkwey14ZRv6CfYkiQmwdJYALre', 1),
(13, 'wineedit', '$2b$10$c7oplUVObqSmdTswEhrFo.tk1QId5YqRBkAWMchKdFjgTczfSmIuy', 1),
(14, 'maymizewffsdf', '$2b$10$IGZBkAH8.UKw7ySggDuKvuvxjglPwbLecMIwZzk4o9jYPg7khb8e2', 1),
(17, 'Tul', '$2b$10$HZIsZ0E84jTp.4vDR1s24.5Yh9cIVZxmAzDf9T/07x7CI7erKBs5W', 1),
(18, 'winaDWE', '$2b$10$QYEp.VDFf4CahFgZKLp06OUVp11KqzwnPm6jtBT9QeSL7Jg2mf.iS', 1),
(19, 'zlencol21', '$2b$10$Mj27UWb4d26CWncmNS/tfOs5dj0aYxfU33YztePn4rbFqZb4hNkZm', 1),
(20, 'zlencol123', '$2b$10$x.UQEMgU5TqB1aveQSjcEeunKoTXCe9zfPkd8i5nb70D4yFg9SEBK', 1),
(21, 'pindw', '$2b$10$0dRqeDwQRn5jD7WDnT4NgOmVhEndmMJD9HJjAWoMomT6.F0W1atoe', 1),
(22, 'cd', '$2b$10$moXX63qMGGGTbh4VoSN2OOLRo3sb2xIgK/Sw1iLZ0ePZBiXEY3eMm', 1),
(23, 'se', '$2b$10$5JlEkidfI1AgmnjUcnrPheubBWCxNzByoPwWQA3JhqY.rpzrSMsYm', 1),
(24, 'Sa', '$2b$10$dKLi4UdoKi5TebMn9Jn0eeQ8Q/RUgqWOAMScuflNqt96NsnRzum9C', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`ad_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `balancess`
--
ALTER TABLE `balancess`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cs_id` (`cs_id`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`cs_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `owner`
--
ALTER TABLE `owner`
  ADD PRIMARY KEY (`ow_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `ad_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `balancess`
--
ALTER TABLE `balancess`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `owner`
--
ALTER TABLE `owner`
  MODIFY `ow_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `balancess`
--
ALTER TABLE `balancess`
  ADD CONSTRAINT `balancess_ibfk_1` FOREIGN KEY (`cs_id`) REFERENCES `customer` (`cs_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `customer`
--
ALTER TABLE `customer`
  ADD CONSTRAINT `customer_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `owner`
--
ALTER TABLE `owner`
  ADD CONSTRAINT `owner_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
