CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE systems (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  code VARCHAR(50) UNIQUE,
  api_url VARCHAR(255),
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  system_id INT,
  name VARCHAR(50),
  -- monthly / yearly
  price DECIMAL(10, 2),
  duration_days INT,
  -- 30 / 365
  FOREIGN KEY (system_id) REFERENCES systems(id)
);
CREATE TABLE subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  system_id INT,
  plan_id INT,
  status ENUM('pending', 'active', 'expired', 'cancelled') DEFAULT 'pending',
  start_date DATETIME,
  end_date DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (system_id) REFERENCES systems(id),
  FOREIGN KEY (plan_id) REFERENCES plans(id)
);
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subscription_id INT,
  amount DECIMAL(10, 2),
  method ENUM('KHQR', 'ABA', 'WING', 'CASH'),
  status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
  transaction_ref VARCHAR(100),
  paid_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id)
);
CREATE TABLE companies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50),
  -- admin / user / manager
  description VARCHAR(255)
);
CREATE TABLE user_roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  role_id INT,
  system_id INT,
  -- Optional: role per system
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (system_id) REFERENCES systems(id)
);
CREATE TABLE subscription_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subscription_id INT,
  action ENUM(
    'created',
    'activated',
    'renewed',
    'expired',
    'cancelled'
  ),
  action_by INT,
  -- user/admin
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id),
  FOREIGN KEY (action_by) REFERENCES users(id)
);
CREATE TABLE system_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  system_id INT,
  key_name VARCHAR(100),
  value_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (system_id) REFERENCES systems(id)
);
CREATE TABLE coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) UNIQUE,
  discount_percent INT,
  valid_from DATE,
  valid_to DATE,
  status ENUM('active', 'inactive') DEFAULT 'active'
);
CREATE TABLE subscription_coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subscription_id INT,
  coupon_id INT,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id),
  FOREIGN KEY (coupon_id) REFERENCES coupons(id)
);
CREATE TABLE payment_callbacks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  payment_id INT,
  callback_data JSON,
  status ENUM('pending', 'processed', 'failed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (payment_id) REFERENCES payments(id)
);