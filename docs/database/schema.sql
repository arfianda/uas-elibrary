-- ==========================================================
-- SKEMA DATABASE: SISTEM E-LIBRARY & KOMIK DIGITAL
-- MATAKULIAH: PEMROGRAMAN WEB 2 (UAS)
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `uas_elibrary`;
USE `uas_elibrary`;

-- 1. TABEL: users (Otentikasi Administrator)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'member') DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. TABEL: genres (Kategori Buku/Komik)
CREATE TABLE IF NOT EXISTS `genres` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. TABEL: books (Katalog Buku/Komik Digital)
CREATE TABLE IF NOT EXISTS `books` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `genre_id` INT NULL,
  `title` VARCHAR(200) NOT NULL,
  `author` VARCHAR(150) NOT NULL,
  `cover_url` VARCHAR(255) DEFAULT 'default-cover.png',
  `read_url` VARCHAR(255) DEFAULT NULL, -- Tautan konten digital untuk dibaca online
  `pdf_path` VARCHAR(255) DEFAULT NULL, -- Path file PDF asli
  `is_free` TINYINT(1) DEFAULT 1, -- 1 = free, 0 = rent-only
  `synopsis` TEXT,
  `status` ENUM('available', 'archived') DEFAULT 'available',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`genre_id`) REFERENCES `genres`(`id`) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. TABEL: rentals (Transaksi Sewa Buku)
CREATE TABLE IF NOT EXISTS `rentals` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `book_id` INT NOT NULL,
  `rent_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `return_date` TIMESTAMP NULL DEFAULT NULL,
  `status` ENUM('rented', 'returned') DEFAULT 'rented',
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================================
-- SEED DATA AWAL (UNTUK TESTING)
-- ==========================================================

-- Password Admin: password123 (Sudah di-hash bcrypt)
INSERT INTO `users` (`username`, `email`, `password`, `role`) VALUES
('admin', 'admin@elibrary.com', '$2y$10$B7qIfe9X5iLclvN3lM8kfePzGv7U6t12wA2mB79mJvMhB8X6E.V1q', 'admin');

-- Seed Data Genre
INSERT INTO `genres` (`name`, `description`) VALUES
('Shounen Manga', 'Komik aksi dan petualangan dengan semangat pantang menyerah.'),
('Sci-Fi Novel', 'Fiksi ilmiah yang mengeksplorasi masa depan dan teknologi.'),
('Edukasi IT', 'Buku referensi pemrograman dan teknologi informasi.');

-- Seed Data Buku / Komik
INSERT INTO `books` (`genre_id`, `title`, `author`, `cover_url`, `read_url`, `synopsis`) VALUES
(1, 'One Piece: Romance Dawn', 'Eiichiro Oda', '🏴‍☠️', '#chapter-1', 'Awal mula petualangan Monkey D. Luffy menjadi raja bajak laut.'),
(1, 'Naruto: Uzumaki', 'Masashi Kishimoto', '🦊', '#chapter-1', 'Kisah ninja muda yang menyimpan siluman rubah ekor sembilan di tubuhnya.'),
(2, 'Dune: Sang Penakluk', 'Frank Herbert', '🏜️', '#chapter-1', 'Eksplorasi planet gurun Arrakis yang menyimpan sumber daya rempah.'),
(3, 'Mastering VueJS 3', 'Evan You', '📗', '#chapter-1', 'Buku panduan lengkap memahami konsep framework VueJS 3 dan Composition API.');