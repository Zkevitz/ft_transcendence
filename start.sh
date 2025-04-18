#!/bin/bash

# Script de démarrage pour ft_transcendence
# Ce script vérifie les prérequis, génère les certificats SSL et lance les conteneurs Docker

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages d'information
info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

# Fonction pour afficher les avertissements
warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Fonction pour afficher les erreurs
error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérification de l'existence du fichier .env
if [ ! -f .env ]; then
    warning "Fichier .env non trouvé. Création à partir de .env.example..."
    
    # Création du fichier .env à partir de .env.example
    cat > .env << EOL
# Configuration de l'application
NODE_ENV=development
PORT=3000
HOST=localhost

# Configuration JWT
JWT_SECRET=$(openssl rand -hex 32)
JWT_EXPIRES_IN=86400 # 24 heures en secondes

# Configuration de la base de données
DB_PATH=./database.sqlite

# Configuration OAuth (à compléter si nécessaire)
OAUTH_GOOGLE_CLIENT_ID=
OAUTH_GOOGLE_CLIENT_SECRET=
OAUTH_CALLBACK_URL=https://localhost:8443/api/auth/callback
EOL
    
    info "Fichier .env créé. Veuillez vérifier et modifier les valeurs si nécessaire."
fi

# Vérification et génération des certificats SSL
if [ ! -d "docker/ssl" ] || [ ! -f "docker/ssl/server.crt" ] || [ ! -f "docker/ssl/server.key" ]; then
    info "Génération des certificats SSL..."
    
    # Création du répertoire ssl s'il n'existe pas
    mkdir -p docker/ssl
    
    # Génération d'un certificat auto-signé
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout docker/ssl/server.key -out docker/ssl/server.crt -subj "/C=FR/ST=Paris/L=Paris/O=42/OU=ft_transcendence/CN=localhost"
    
    info "Certificats SSL générés avec succès dans le répertoire docker/ssl/"
fi

# Arrêt des conteneurs existants
info "Arrêt des conteneurs existants..."
docker-compose down

# Construction et démarrage des conteneurs
info "Construction et démarrage des conteneurs..."
if docker-compose up --build -d; then
    info "L'application est maintenant accessible sur https://localhost:8443"
    info "Backend API: https://localhost:8443/api"
    info "Frontend: https://localhost:8443"
else
    error "Une erreur s'est produite lors du démarrage de l'application."
    exit 1
fi
