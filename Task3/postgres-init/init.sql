--postgres-init/init.sql
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion de données de test
INSERT INTO products (name, description, price) VALUES
('Smartphone XYZ', 'Un smartphone dernier cri avec appareil photo haute résolution', 599.99),
('Ordinateur portable Pro', 'Ordinateur portable avec processeur rapide et grande autonomie', 1299.99),
('Casque audio sans fil', 'Casque avec réduction de bruit active et son immersif', 199.99),
('Montre connectée Sport', 'Montre intelligente avec suivi d''activité et GPS intégré', 249.99),
('Enceinte Bluetooth portable', 'Enceinte waterproof avec 20h d''autonomie', 89.99),
('Tablette 10 pouces', 'Tablette avec écran haute résolution et processeur performant', 349.99),
('Souris ergonomique', 'Souris sans fil avec design ergonomique pour réduire la fatigue', 49.99),
('Clavier mécanique Gamer', 'Clavier avec rétroéclairage RGB et switches mécaniques', 129.99),
('SSD 1TB', 'Disque SSD haute vitesse pour améliorer les performances de votre PC', 99.99),
('Routeur WiFi 6', 'Routeur nouvelle génération avec couverture étendue et débit ultra-rapide', 159.99);
