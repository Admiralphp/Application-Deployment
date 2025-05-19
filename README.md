# Application d'Inventaire Flask avec Docker

Cette application est une solution de gestion d'inventaire développée avec Flask et MySQL, conteneurisée avec Docker.

## Prérequis

- Docker
- Docker Compose
- Git (pour cloner le repository)

## Configuration

L'application utilise les variables d'environnement suivantes (déjà configurées dans docker-compose.yml) :

- `DB_HOST`: Hôte de la base de données (défaut: db)
- `DB_USER`: Utilisateur de la base de données (défaut: inventoryuser)
- `DB_PASSWORD`: Mot de passe de la base de données (défaut: secret)
- `DB_NAME`: Nom de la base de données (défaut: inventory)

## Installation et Démarrage

1. Cloner le repository :
   ```bash
   git clone https://github.com/DevOps-Master-2024/Application-Deployment.git
   cd <repository-directory>
   ```

2. Construire et démarrer les conteneurs :
   ```bash
   docker-compose up --build
   ```

L'application sera accessible à l'adresse : http://localhost:5000

## Structure des Conteneurs

- **Web (Flask)**
  - Base: Python 3.9 slim
  - Exécuté en tant qu'utilisateur non-root
  - Healthcheck configuré
  - Volume persistant pour /app/data

- **Database (MySQL)**
  - MySQL 8.0
  - Données persistantes via volume
  - Initialisation automatique via schema.sql
  - Healthcheck configuré

## Volumes

- `app_data`: Données persistantes de l'application Flask
- `mysql_data`: Données persistantes MySQL

## Réseau

Les conteneurs communiquent via un réseau bridge dédié `inventory_net`

## Sécurité

- Utilisation d'un utilisateur non-root pour l'application
- Variables d'environnement pour les secrets
- Conteneurs isolés dans leur propre réseau
- Images de base minimales (slim)

## Maintenance

- Arrêter les conteneurs :
  ```bash
  docker-compose down
  ```

- Voir les logs :
  ```bash
  docker-compose logs
  ```

- Redémarrer un service :
  ```bash
  docker-compose restart [service]
  ```

## Backup

Pour sauvegarder la base de données :
```bash
docker exec -it [container-mysql] mysqldump -u inventoryuser -psecret inventory > backup.sql
```

## Support

En cas de problème :
1. Vérifier les logs : `docker-compose logs`
2. Vérifier l'état des conteneurs : `docker-compose ps`
3. Vérifier les healthchecks : `docker inspect [container-id]`
