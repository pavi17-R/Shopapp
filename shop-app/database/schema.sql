-- ============================================================
-- FILE: database/schema.sql
-- PURPOSE: Defines all MySQL tables and inserts sample data.
-- Run this file once to set up your database before starting
-- the backend server.
-- ============================================================

-- Create and select the database
CREATE DATABASE IF NOT EXISTS shopapp;
USE shopapp;

-- -------------------------------------------------------
-- TABLE: users
-- Stores registered user accounts.
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,        -- bcrypt hashed password
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------
-- TABLE: products
-- Stores all products available in the shop.
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(500),
  category VARCHAR(100),
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------
-- TABLE: cart
-- Stores items added to a user's shopping cart.
-- Each row = one product in one user's cart.
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- TABLE: wishlist
-- Stores products a user has saved for later.
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS wishlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_wishlist (user_id, product_id)  -- prevent duplicates
);

-- -------------------------------------------------------
-- TABLE: orders
-- Stores each order placed by a user.
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered') DEFAULT 'pending',
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- TABLE: order_items
-- Stores individual products within each order.
-- One order can have many order_items.
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,   -- price at time of purchase
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- SAMPLE DATA: Insert 12 demo products
-- -------------------------------------------------------
INSERT INTO products (name, description, price, image_url, category, stock) VALUES
('Wireless Noise-Cancelling Headphones',
 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and exceptional sound quality.',
 89.99,
 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
 'Electronics', 50),

('Mechanical Gaming Keyboard',
 'RGB backlit mechanical keyboard with tactile switches, anti-ghosting, and durable aluminum frame.',
 64.99,
 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600',
 'Electronics', 35),

('Running Shoes - CloudStep Pro',
 'Lightweight running shoes with responsive cushioning, breathable mesh upper, and durable rubber outsole.',
 119.99,
 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
 'Footwear', 80),

('Stainless Steel Water Bottle',
 'Double-wall insulated bottle keeps drinks cold 24hrs or hot 12hrs. BPA-free, leak-proof lid.',
 24.99,
 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600',
 'Kitchen', 120),

('Minimalist Leather Wallet',
 'Slim RFID-blocking genuine leather wallet with 6 card slots and a bill compartment.',
 34.99,
 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600',
 'Accessories', 60),

('Portable Bluetooth Speaker',
 'Waterproof speaker with 360° sound, 20-hour battery, and built-in microphone for calls.',
 49.99,
 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600',
 'Electronics', 45),

('Classic Analog Wristwatch',
 'Japanese quartz movement with stainless steel case, sapphire crystal glass, and leather strap.',
 149.99,
 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
 'Accessories', 25),

('Yoga Mat - EcoGrip',
 'Non-slip eco-friendly TPE yoga mat, 6mm thick, with carrying strap. Ideal for all yoga styles.',
 39.99,
 'https://images.unsplash.com/photo-1601925228596-d5091f0a2fc2?w=600',
 'Sports', 70),

('Ceramic Coffee Mug Set',
 'Set of 4 handcrafted ceramic mugs, 12oz each. Microwave and dishwasher safe. Earthy tones.',
 29.99,
 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600',
 'Kitchen', 90),

('Sunglasses - UV400 Shield',
 'Polarized sunglasses with UV400 protection, lightweight TR90 frame, and scratch-resistant lenses.',
 54.99,
 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600',
 'Accessories', 55),

('Hardcover Notebook - DotGrid',
 'A5 dot-grid hardcover notebook, 200 pages, with ribbon bookmark and elastic closure band.',
 18.99,
 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600',
 'Stationery', 100),

('USB-C 65W Fast Charger',
 'GaN technology fast charger with USB-C and USB-A ports. Charges laptop, phone, and tablet simultaneously.',
 44.99,
 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600',
 'Electronics', 65);
