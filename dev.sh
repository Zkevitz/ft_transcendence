#!/bin/bash

# Script de démarrage pour ft_transcendence en mode développement
# Ce script lance les conteneurs Docker en mode développement avec HCR

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
OAUTH_CALLBACK_URL=http://localhost:8080/api/auth/callback
EOL
    
    info "Fichier .env créé. Veuillez vérifier et modifier les valeurs si nécessaire."
fi

# Arrêt des conteneurs existants
info "Arrêt des conteneurs existants..."
docker-compose down --remove-orphans

# Construction et démarrage des conteneurs en mode développement
info "Construction et démarrage des conteneurs en mode développement avec HCR..."
if docker-compose -f docker-compose.dev.yml up --build; then
    info "L'application est maintenant accessible:"
    info "Frontend: http://localhost:8080"
    info "Backend API: http://localhost:3000"
else
    error "Une erreur s'est produite lors du démarrage de l'application en mode développement."
    exit 1
fi
