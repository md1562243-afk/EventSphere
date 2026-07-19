-- EventSphere Database Schema
-- MySQL 8+
-- Preserves the instructor-approved ER diagram and relational mapping exactly.

CREATE DATABASE IF NOT EXISTS eventsphere
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE eventsphere;

-- ============================================================
-- ADMIN
-- ============================================================
CREATE TABLE IF NOT EXISTS Admin (
  admin_id     INT AUTO_INCREMENT PRIMARY KEY,
  first_name   VARCHAR(100) NOT NULL,
  last_name    VARCHAR(100) NOT NULL,
  email        VARCHAR(150) NOT NULL UNIQUE,
  password     VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Admin_Phone (
  admin_id  INT NOT NULL,
  phone_no  VARCHAR(20) NOT NULL,
  PRIMARY KEY (admin_id, phone_no),
  FOREIGN KEY (admin_id) REFERENCES Admin(admin_id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- USER
-- ============================================================
CREATE TABLE IF NOT EXISTS User (
  user_id      INT AUTO_INCREMENT PRIMARY KEY,
  first_name   VARCHAR(100) NOT NULL,
  last_name    VARCHAR(100) NOT NULL,
  email        VARCHAR(150) NOT NULL UNIQUE,
  password     VARCHAR(255) NOT NULL,
  admin_id     INT NULL,
  FOREIGN KEY (admin_id) REFERENCES Admin(admin_id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS User_Phone (
  user_id   INT NOT NULL,
  phone_no  VARCHAR(20) NOT NULL,
  PRIMARY KEY (user_id, phone_no),
  FOREIGN KEY (user_id) REFERENCES User(user_id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- ORGANIZER
-- ============================================================
CREATE TABLE IF NOT EXISTS Organizer (
  organizer_id  INT AUTO_INCREMENT PRIMARY KEY,
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password      VARCHAR(255) NOT NULL,
  admin_id      INT NULL,
  status        ENUM('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
  FOREIGN KEY (admin_id) REFERENCES Admin(admin_id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Organizer_Phone (
  organizer_id  INT NOT NULL,
  phone_no      VARCHAR(20) NOT NULL,
  PRIMARY KEY (organizer_id, phone_no),
  FOREIGN KEY (organizer_id) REFERENCES Organizer(organizer_id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- EVENT
-- ============================================================
CREATE TABLE IF NOT EXISTS Event (
  event_id       INT AUTO_INCREMENT PRIMARY KEY,
  event_name     VARCHAR(200) NOT NULL,
  event_type     VARCHAR(100) NOT NULL,
  event_date     DATE NOT NULL,
  event_time     TIME NOT NULL,
  event_venue    VARCHAR(200) NOT NULL,
  ticket_price   DECIMAL(10,2) NOT NULL CHECK (ticket_price > 0),
  organizer_id   INT NOT NULL,
  admin_id       INT NULL,
  FOREIGN KEY (organizer_id) REFERENCES Organizer(organizer_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (admin_id) REFERENCES Admin(admin_id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX idx_event_name (event_name),
  INDEX idx_event_type (event_type)
) ENGINE=InnoDB;

-- ============================================================
-- BOOKING
-- ============================================================
CREATE TABLE IF NOT EXISTS Booking (
  booking_id       INT AUTO_INCREMENT PRIMARY KEY,
  booking_status   ENUM('Pending','Confirmed','Cancelled') NOT NULL DEFAULT 'Pending',
  event_id         INT NULL,
  event_date       DATE NOT NULL,
  event_time       TIME NOT NULL,
  event_venue      VARCHAR(200) NOT NULL,
  user_id          INT NOT NULL,
  admin_id         INT NULL,
  FOREIGN KEY (event_id) REFERENCES Event(event_id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES User(user_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES Admin(admin_id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX idx_booking_user (user_id),
  INDEX idx_booking_event (event_id)
) ENGINE=InnoDB;

-- ============================================================
-- PAYMENT
-- ============================================================
CREATE TABLE IF NOT EXISTS Payment (
  payment_id      INT AUTO_INCREMENT PRIMARY KEY,
  payment_date    DATE NOT NULL,
  payment_time    TIME NOT NULL,
  payment_method  ENUM('bKash','Nagad','Credit Card','Debit Card','Cash') NOT NULL,
  payment_status  ENUM('Pending','Confirmed') NOT NULL DEFAULT 'Pending',
  payment_amount  DECIMAL(10,2) NOT NULL CHECK (payment_amount > 0),
  booking_id      INT NOT NULL,
  admin_id        INT NULL,
  FOREIGN KEY (booking_id) REFERENCES Booking(booking_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES Admin(admin_id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX idx_payment_booking (booking_id)
) ENGINE=InnoDB;

-- ============================================================
-- BROWSE (bridge table: many-to-many User <-> Event)
-- ============================================================
CREATE TABLE IF NOT EXISTS Browse (
  event_id    INT NOT NULL,
  user_id     INT NOT NULL,
  PRIMARY KEY (event_id, user_id),
  FOREIGN KEY (event_id) REFERENCES Event(event_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES User(user_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  INDEX idx_browse_user (user_id),
  INDEX idx_browse_event (event_id)
) ENGINE=InnoDB;
