#!/bin/bash

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}[INFO] Arrêt des services ft_transcendence...${NC}"

# Arrêt des conteneurs Docker
echo -e "${YELLOW}[INFO] Arrêt des conteneurs Docker...${NC}"
if docker ps -q --filter "name=ft_trans" | grep -q .; then
    docker-compose down --remove-orphans
    echo -e "${GREEN}[SUCCESS] Conteneurs Docker arrêtés avec succès${NC}"
else
    echo -e "${YELLOW}[INFO] Aucun conteneur Docker en cours d'exécution${NC}"
fi

# Arrêt des processus Node.js
echo -e "${YELLOW}[INFO] Recherche et arrêt des processus Node.js liés au projet...${NC}"
NODE_PIDS=$(pgrep -f "node.*git_trans")
if [ -n "$NODE_PIDS" ]; then
    echo -e "${YELLOW}[INFO] Processus Node.js trouvés : $NODE_PIDS${NC}"
    for pid in $NODE_PIDS; do
        echo -e "${YELLOW}[INFO] Arrêt du processus $pid...${NC}"
        kill -15 $pid 2>/dev/null || true
    done
    echo -e "${GREEN}[SUCCESS] Processus Node.js arrêtés${NC}"
else
    echo -e "${YELLOW}[INFO] Aucun processus Node.js lié au projet trouvé${NC}"
fi

# Arrêt des processus npm
echo -e "${YELLOW}[INFO] Recherche et arrêt des processus npm liés au projet...${NC}"
NPM_PIDS=$(pgrep -f "npm.*git_trans")
if [ -n "$NPM_PIDS" ]; then
    echo -e "${YELLOW}[INFO] Processus npm trouvés : $NPM_PIDS${NC}"
    for pid in $NPM_PIDS; do
        echo -e "${YELLOW}[INFO] Arrêt du processus $pid...${NC}"
        kill -15 $pid 2>/dev/null || true
    done
    echo -e "${GREEN}[SUCCESS] Processus npm arrêtés${NC}"
else
    echo -e "${YELLOW}[INFO] Aucun processus npm lié au projet trouvé${NC}"
fi

# Suppression des dossiers dist
echo -e "${YELLOW}[INFO] Suppression des dossiers dist...${NC}"
if [ -d "frontend/dist" ] || [ -d "backend/dist" ]; then
    # Suppression complète des dossiers dist avec sudo pour gérer les fichiers appartenant à root
    sudo rm -rf frontend/dist backend/dist 2>/dev/null || true
    echo -e "${GREEN}[SUCCESS] Dossiers dist supprimés${NC}"
else
    echo -e "${YELLOW}[INFO] Aucun dossier dist trouvé${NC}"
fi

# Vérification finale
sleep 2
if docker ps -q --filter "name=git_trans" | grep -q .; then
    echo -e "${RED}[WARNING] Certains conteneurs Docker sont toujours en cours d'exécution${NC}"
    echo -e "${YELLOW}[INFO] Forçage de l'arrêt des conteneurs...${NC}"
    docker-compose down -v --remove-orphans
    echo -e "${GREEN}[SUCCESS] Tous les conteneurs ont été forcés à s'arrêter${NC}"
fi

NODE_PIDS=$(pgrep -f "node.*git_trans")
if [ -n "$NODE_PIDS" ]; then
    echo -e "${RED}[WARNING] Certains processus Node.js sont toujours en cours d'exécution${NC}"
    echo -e "${YELLOW}[INFO] Forçage de l'arrêt des processus...${NC}"
    for pid in $NODE_PIDS; do
        kill -9 $pid 2>/dev/null || true
    done
    echo -e "${GREEN}[SUCCESS] Tous les processus ont été forcés à s'arrêter${NC}"
fi

echo -e "${GREEN}[SUCCESS] Tous les services ont été arrêtés avec succès${NC}"
