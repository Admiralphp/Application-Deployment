CREATE DATABASE IF NOT EXISTS inventory;
USE inventory;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insérer quelques données de test
INSERT INTO products (name, price, quantity) VALUES 
('Moniteur 24"', 199.99, 10),
('Clavier mécanique', 89.99, 15),
('Souris sans fil', 29.99, 20)
ON DUPLICATE KEY UPDATE name=name;