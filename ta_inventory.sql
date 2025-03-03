-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 03, 2025 at 01:13 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ta_inventory`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `equipment_name` varchar(255) NOT NULL,
  `item_type` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `equipment_name`, `item_type`, `created_at`, `updated_at`) VALUES
(9, 'Keyboard', 'Input Device', '2025-02-26 12:31:18', '2025-02-27 06:10:43'),
(10, 'Monitor', 'Output Device', '2025-02-26 12:31:35', '2025-02-27 06:10:41'),
(11, 'Mouse', 'Input Device', '2025-02-26 12:32:41', '2025-02-27 06:10:28'),
(13, 'Headset', 'Output Device', '2025-02-27 04:20:26', '2025-02-27 06:10:25'),
(14, 'Memory', 'Input Device', '2025-02-27 05:31:57', '2025-02-27 06:10:01'),
(16, 'SSD', 'Storage Device', '2025-02-28 04:38:52', '2025-02-28 04:38:52');

-- --------------------------------------------------------

--
-- Table structure for table `defectives`
--

CREATE TABLE `defectives` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `item_id` bigint(20) UNSIGNED NOT NULL,
  `managers_name` varchar(255) NOT NULL,
  `cluster` varchar(255) NOT NULL,
  `floor` varchar(255) NOT NULL,
  `area` varchar(255) NOT NULL,
  `incident_details` varchar(255) NOT NULL,
  `person_incharge` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `defectives`
--

INSERT INTO `defectives` (`id`, `item_id`, `managers_name`, `cluster`, `floor`, `area`, `incident_details`, `person_incharge`, `status`, `note`, `created_at`, `updated_at`) VALUES
(16, 58, 'NA', 'NA', '4th Floor', '2', 'Broken RAM and Monitor', 'Sean Peralta', 'Replaced', NULL, '2024-02-28 12:35:48', '2025-02-27 12:35:48'),
(17, 62, 'NA', 'NA', '4th Floor', '2', 'Broken RAM and Monitor', 'Sean Peralta', 'Replaced', NULL, '2025-02-01 12:35:48', '2025-02-27 12:35:48'),
(18, 65, 'NA', 'NA', '7th Floor', '2', 'Broken Headset and Monitor', 'Jester Cardinal', 'Replaced', NULL, '2025-02-27 12:36:21', '2025-02-27 12:36:21'),
(19, 69, 'NA', 'NA', '7th Floor', '2', 'Broken Headset and Monitor', 'Jester Cardinal', 'Replaced', NULL, '2025-02-27 12:36:21', '2025-02-27 12:36:21'),
(20, 61, 'NA', 'NA', '7th Floor', '1', 'Broken Memory and Headset', 'Paolo Alejaga', 'Replaced', NULL, '2025-01-15 12:37:14', '2025-02-27 12:37:14'),
(21, 68, 'NA', 'NA', '7th Floor', '1', 'Broken Memory and Headset', 'Paolo Alejaga', 'Replaced', NULL, '2025-02-27 12:37:14', '2025-02-27 12:37:14'),
(22, 59, 'NA', 'NA', '7th Floor', '1', 'Broken Memory and Headset', 'Paolo Alejaga', 'Replaced', NULL, '2025-02-27 12:37:14', '2025-02-27 12:37:14');

-- --------------------------------------------------------

--
-- Table structure for table `equipments`
--

CREATE TABLE `equipments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `equipment_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `equipments`
--

INSERT INTO `equipments` (`id`, `equipment_name`, `created_at`, `updated_at`) VALUES
(1, 'Mouse', '2025-02-21 07:59:32', '2025-02-21 07:59:32'),
(2, 'Keyboard', '2025-02-24 04:29:25', '2025-02-24 04:29:25'),
(3, 'Cord', '2025-02-24 05:26:11', '2025-02-24 05:26:11'),
(4, 'Monitor', '2025-02-26 04:59:32', '2025-02-26 04:59:32'),
(5, 'Headset', '2025-02-27 04:20:26', '2025-02-27 04:20:26'),
(6, 'Memory', '2025-02-27 05:31:57', '2025-02-27 05:31:57'),
(7, 'SSD', '2025-02-28 04:38:52', '2025-02-28 04:38:52');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(8, '0001_01_01_000000_create_users_table', 1),
(9, '0001_01_01_000001_create_cache_table', 1),
(29, '2025_02_21_142136_equipments_table', 2),
(30, '2025_02_12_160552_create_orders_table', 3),
(31, '2025_01_28_192736_create_defectives_table', 4),
(33, '2025_02_26_134126_create_supplier_table', 5);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('zSSZeoJQtWBYD2HOomnpV4LbE8rtf8rtFT5HrX02', 7, '172.20.0.135', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiaHg5bmtSc1NkYWt2aFhraGZyU1phWjdrUDUyNnp5TGl0UmRObGdPOCI7czozOiJ1cmwiO2E6MDp7fXM6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjM0OiJodHRwOi8vMTcyLjIwLjAuMTM1OjgwMDAvZGVmZWN0aXZlIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6Nzt9', 1740774935);

-- --------------------------------------------------------

--
-- Table structure for table `stocks`
--

CREATE TABLE `stocks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `equipment_name` varchar(255) NOT NULL,
  `item_type` varchar(255) NOT NULL,
  `brand` varchar(255) NOT NULL,
  `model` varchar(255) NOT NULL,
  `serial_number` varchar(255) NOT NULL,
  `supplier` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stocks`
--

INSERT INTO `stocks` (`id`, `category_id`, `equipment_name`, `item_type`, `brand`, `model`, `serial_number`, `supplier`, `created_at`, `updated_at`) VALUES
(58, 14, 'Memory', 'Input Device', 'Corsair', 'Vengeance LPX', 'FDFEDFKMS', 'TechnoMart', '2025-02-20 12:30:31', '2025-02-27 12:30:31'),
(59, 14, 'Memory', 'Input Device', 'Corsair', 'Vengeance RGB Pro', 'FEDESFWSF', 'TechnoMart', '2025-02-27 12:30:31', '2025-02-27 12:30:31'),
(60, 14, 'Memory', 'Input Device', 'Kingston', 'Fury Beast', 'GFDSG4WEQDF', 'Laptop Enterprise', '2025-02-27 12:30:31', '2025-02-27 12:30:31'),
(61, 14, 'Memory', 'Input Device', 'Kingston', 'Fury Renegade', 'DSFGDSFGDSFG', 'Lasortech', '2025-02-27 12:30:31', '2025-02-27 12:30:31'),
(62, 10, 'Monitor', 'Output Device', 'Dell', 'Dell UltraSharp U2723QE', 'GVERSFDGEEWSDF', 'Laptop Enterprise', '2025-02-27 12:32:38', '2025-02-27 12:32:38'),
(63, 10, 'Monitor', 'Output Device', 'Dell', 'Dell S2721DGF', 'sdafwrsadfgw', 'Laptop Enterprise', '2025-02-27 12:32:38', '2025-02-27 12:32:38'),
(64, 10, 'Monitor', 'Output Device', 'LG', 'LG UltraGear 27GP850-B', 'SFADGSARDGWWF', 'Laptop Enterprise', '2025-02-27 12:32:38', '2025-02-27 12:32:38'),
(65, 10, 'Monitor', 'Output Device', 'LG', 'LG 32UN880-B UltraFine Ergo', 'ASGEWRGEWRGERG', 'Laptop Enterprise', '2025-02-27 12:32:38', '2025-02-27 12:32:38'),
(66, 10, 'Monitor', 'Output Device', 'Samsung', 'Samsung Odyssey G7 (LC27G75TQSNXZA)', 'SDAFSEDFTRFWERRTF', 'Laptop Enterprise', '2025-02-27 12:32:38', '2025-02-27 12:32:38'),
(67, 10, 'Monitor', 'Output Device', 'Samsung', 'Samsung Odyssey Neo G9', 'DFASFWSADEFFDS', 'Laptop Enterprise', '2025-02-27 12:32:38', '2025-02-27 12:32:38'),
(68, 13, 'Headset', 'Output Device', 'Logitech G', 'Logitech G Pro X Wireless', 'SDFGDGFWE', 'Lasortech', '2025-02-27 12:34:29', '2025-02-27 12:34:29'),
(69, 13, 'Headset', 'Output Device', 'Logitech G', 'Logitech G733 Lightspeed', 'FEWRSDGFERG', 'Lasortech', '2025-02-27 12:34:29', '2025-02-27 12:34:29'),
(70, 13, 'Headset', 'Output Device', 'Corsair', 'Corsair Virtuoso RGB Wireless XT', 'WETFWESFEWQRFWEF', 'Lasortech', '2025-02-27 12:34:29', '2025-02-27 12:34:29'),
(71, 13, 'Headset', 'Output Device', 'Corsair', 'Corsair HS80 RGB Wireless', 'DFSDFEWTRFV', 'Lasortech', '2025-02-27 12:34:29', '2025-02-27 12:34:29'),
(72, 16, 'SSD', 'Storage Device', 'Samsung', 'Evo', 'FDSFERERD43', 'Lasortech', '2025-02-28 04:39:39', '2025-02-28 04:39:39'),
(73, 16, 'SSD', 'Storage Device', 'Lenovo', '64321', 'FEFE24FDGF', 'TechnoMart', '2025-02-22 04:39:39', '2025-02-28 04:39:39');

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `supplier_name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`id`, `supplier_name`, `address`, `phone_number`, `email`, `created_at`, `updated_at`) VALUES
(6, 'Lasortech', 'Jaro, Iloilo', '09850254406', 'lasortech@gmail.com', '2025-02-26 12:17:13', '2025-02-26 12:26:12'),
(7, 'Laptop Enterprise', 'Lapaz, Iloilo', '09924321314', 'lapenterprise@gmail.com', '2025-02-26 12:26:50', '2025-02-26 12:26:50'),
(8, 'TechnoMart', 'City Proper, Iloilo', '09454235434', 'tecnomart@gmail.com', '2025-02-26 12:27:26', '2025-02-26 12:28:21');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL DEFAULT 'IT',
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `role`, `department`, `email`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(4, 'Sean', 'Peralta', 'Moderator', 'IT', 'sean@gmail.com', '$2y$12$8BLFHEIZCdySIdFTwvk2iOeXZ8G5zrhT9bMp4fIrymdwXpEGATrEq', NULL, '2025-02-05 10:13:26', '2025-02-05 10:13:26'),
(6, 'Paolo', 'Alejaga', 'Admin', 'IT', 'paolo@gmail.com', '$2y$12$Fq28X87LdzWzSeJaa5tMweOcSUPNnzERQgE2Yfyk9C1M97Pm49mY6', NULL, '2025-02-06 09:33:43', '2025-02-12 05:19:50'),
(7, 'Charles Agustin', 'Monreal', 'Admin', 'IT', 'charles@gmail.com', '$2y$12$j/4FJeAiKuUbxbRkIkKfXO.o6HLMBW8S5Liuacl.E4Ksqt.bAqoMq', NULL, '2025-02-12 05:20:12', '2025-02-12 05:20:12'),
(8, 'Jester', 'Cardinal', 'Moderator', 'IT', 'jester@gmail.com', '$2y$12$di6x1yyb9CEFi.POtre5FOMy1XXUhZpbEQu.kCme18XKfxG7T6CdC', NULL, '2025-02-12 06:37:08', '2025-02-12 06:37:08');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `defectives`
--
ALTER TABLE `defectives`
  ADD PRIMARY KEY (`id`),
  ADD KEY `defectives_item_id_foreign` (`item_id`);

--
-- Indexes for table `equipments`
--
ALTER TABLE `equipments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `stocks`
--
ALTER TABLE `stocks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_category` (`category_id`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `defectives`
--
ALTER TABLE `defectives`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `equipments`
--
ALTER TABLE `equipments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `stocks`
--
ALTER TABLE `stocks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `defectives`
--
ALTER TABLE `defectives`
  ADD CONSTRAINT `defectives_item_id_foreign` FOREIGN KEY (`item_id`) REFERENCES `stocks` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stocks`
--
ALTER TABLE `stocks`
  ADD CONSTRAINT `fk_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
