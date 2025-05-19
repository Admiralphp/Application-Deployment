# ShopFast - Application E-commerce Microservices

Cette application e-commerce est construite avec une architecture microservices, utilisant différentes technologies et conteneurisée avec Docker.

## 🏗️ Architecture des Services

- **Frontend** (React)
  - Interface utilisateur
  - Port: 3000
  - Serveur Nginx pour la production

- **API Gateway** (Node.js)
  - Routage et orchestration des services
  - Port: 8080
  - Point d'entrée central

- **Catalogue Service** (Python/Flask)
  - Gestion des produits
  - Utilise PostgreSQL

- **User Service** (Java/Spring)
  - Gestion des utilisateurs
  - Utilise MongoDB et Redis

- **Cart Service** (Node.js/Express)
  - Gestion du panier
  - Utilise Redis

- **Bases de données**
  - PostgreSQL (produits)
  - MongoDB (utilisateurs)
  - Redis (cache/sessions)

## 🚀 Démarrage

### Prérequis

- Docker
- Docker Compose
- Au moins 4GB de RAM disponible

### Installation et lancement

1. **Construire les images**
```powershell
docker-compose build
```

2. **Démarrer l'environnement**
```powershell
docker-compose up -d
```

3. **Vérifier les services**
```powershell
docker-compose ps
```

### Accès à l'application

- Interface utilisateur : http://localhost:3000
- API Gateway : http://localhost:8080

## 🛠️ Commandes utiles

### Logs
```powershell
# Tous les services
docker-compose logs -f

# Service spécifique
docker-compose logs -f api-gateway
```

### Redémarrage
```powershell
# Redémarrer un service
docker-compose restart api-gateway

# Redémarrer tout
docker-compose restart
```

### Arrêt
```powershell
# Arrêter les services
docker-compose down

# Arrêter et supprimer les volumes
docker-compose down -v
```

## 🔧 Choix Techniques

### Réseaux
- Réseau `shopfast-network` en mode bridge
- Isolation et communication sécurisée entre services

### Volumes
- `postgres_data`: Persistance PostgreSQL
- `mongo_data`: Persistance MongoDB

### Healthchecks
- Vérifications HTTP pour les services web
- Vérifications spécifiques pour les bases de données
- Intervalles adaptés à chaque service

### Politiques de redémarrage
- `unless-stopped` pour tous les services
- Garantit la résilience en cas de panne

### Limites de ressources
- Mémoire et CPU limités par service
- Optimisé pour un environnement de production

## 🔍 Monitoring

### État des services
```powershell
# Vérifier l'état de santé
docker-compose ps
```

### Utilisation des ressources
```powershell
docker stats
```

## 🛡️ Sécurité

- Variables d'environnement pour les secrets
- Isolation réseau
- Restrictions de ressources
- Services en mode non-root quand possible

## ⚠️ Dépannage

1. **Les services ne démarrent pas**
   - Vérifier les logs : `docker-compose logs [service]`
   - Vérifier les ressources disponibles

2. **Problèmes de connexion**
   - Vérifier l'état du réseau : `docker network inspect shopfast-network`
   - Vérifier les logs de l'api-gateway

3. **Problèmes de performance**
   - Vérifier l'utilisation des ressources : `docker stats`
   - Ajuster les limites dans docker-compose.yml
