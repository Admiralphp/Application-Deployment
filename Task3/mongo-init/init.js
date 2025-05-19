// mongo-init/init.js
db = db.getSiblingDB('users');

// Création de la collection users s'elle n'existe pas déjà
if (!db.getCollectionNames().includes('users')) {
    db.createCollection('users');
}

// Création d'un index unique sur le nom d'utilisateur et l'email
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true });

// Insertion de quelques utilisateurs de test
db.users.insertMany([
    {
        "username": "john_doe",
        "password": "password123",
        "email": "john.doe@example.com",
        "role": "user"
    },
    {
        "username": "jane_smith",
        "password": "password456",
        "email": "jane.smith@example.com",
        "role": "user"
    },
    {
        "username": "admin_user",
        "password": "admin123",
        "email": "admin@example.com",
        "role": "admin"
    }
]);

print("Initialisation MongoDB terminée");
