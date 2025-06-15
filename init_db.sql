-- 创建数据库
CREATE DATABASE IF NOT EXISTS `flipping-card-game` 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `flipping-card-game`;

-- 用户表
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(36) NOT NULL,
  `username` VARCHAR(50) NOT NULL,
  `password_hash` VARCHAR(100) NOT NULL,
  `total_score` INT DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_unique` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 主题表
CREATE TABLE IF NOT EXISTS `themes` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `color` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_unique` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 主题图片表
CREATE TABLE IF NOT EXISTS `theme_images` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `theme_id` BIGINT NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 分数表
CREATE TABLE IF NOT EXISTS `scores` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(36) NOT NULL,
  `theme` VARCHAR(50) NOT NULL,
  `difficulty` VARCHAR(20) NOT NULL,
  `high_score` INT NOT NULL,
  `last_score` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_theme_difficulty_unique` (`user_id`, `theme`, `difficulty`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 初始化测试数据
INSERT INTO `themes` (`name`, `color`) VALUES 
('Animals', '#FF5733'),
('Cartoons', '#33FF57'),
('Superheroes', '#3357FF');

INSERT INTO `theme_images` (`theme_id`, `image_url`) VALUES
(1, '/images/cat.jpg'),
(1, '/images/dog.jpg'),
(2, '/images/mickey.jpg'),
(2, '/images/donald.jpg'),
(3, '/images/spiderman.jpg'),
(3, '/images/batman.jpg');
