#!/bin/sh
set -e

# Fonction pour attendre que la base de données soit disponible
wait_for_db() {
  echo "Vérification de la disponibilité de la base de données..."
  
  host="${DB_HOST:-db}"
  port="${DB_PORT:-3306}"
  user="${DB_USER:-inventoryuser}"
  password="${DB_PASSWORD:-secret}"
  
  echo "Tentative de connexion à MySQL at $host:$port..."
  
  for i in $(seq 1 30); do
    if (echo > /dev/tcp/$host/$port) >/dev/null 2>&1; then
      echo "MySQL est disponible!"
      return 0
    fi
    
    echo "Attente de MySQL (tentative $i/30)..."
    sleep 2
  done
  
  echo "Impossible de se connecter à MySQL après 30 tentatives!"
  return 1
}

# Attendre que la base de données soit disponible
wait_for_db

# Initialiser la base de données si la variable d'environnement est définie
if [ "${INIT_DB:-False}" = "True" ]; then
  echo "Initialisation de la base de données..."
  python -c "from app import init_db; init_db()"
  echo "Base de données initialisée!"
fi

# Exécuter la commande reçue en paramètre (celle du CMD)
echo "Démarrage de l'application..."
exec "$@"