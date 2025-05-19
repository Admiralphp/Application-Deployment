# React Application Dockerized

Ce projet contient une application React conteneurisée utilisant un build multi-stage pour optimiser la taille de l'image et la sécurité.

## 🏗️ Architecture

L'image Docker est construite en deux étapes :
1. **Stage de build** : Utilise Node.js pour compiler l'application React
2. **Stage de production** : Utilise Nginx pour servir les fichiers statiques

## 🚀 Comment utiliser

### Construction de l'image

```bash
docker build -t react-inventory-app ./
```

### Lancement du conteneur

```bash
docker run -d -p 80:80 react-inventory-app
```

### Accès à l'application

Une fois le conteneur démarré, l'application est accessible à :
http://localhost

## ⚙️ Configuration Nginx

Le conteneur utilise une configuration Nginx personnalisée qui :
- Sert l'application React en tant que SPA (Single Page Application)
- Gère correctement les routes React
- Inclut des en-têtes de sécurité basiques
- Est exécuté avec un utilisateur non-root pour plus de sécurité

## 🔒 Sécurité

- Utilisation d'un utilisateur non-root (nginxuser)
- Image de production minimale sans outils de développement
- Healthcheck intégré
- Build en deux étapes pour réduire la surface d'attaque

## 🔍 Points clés de l'implémentation

- Multi-stage build pour une image finale optimisée
- Utilisation de `npm ci` pour des installations déterministes
- Mise en cache optimisée des layers Docker
- Configuration sécurisée de Nginx
- Healthcheck pour la surveillance du conteneur
