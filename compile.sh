#!/bin/bash

# Script pour compiler le projet ft_transcendence sans avoir besoin de npm local
# Ce script utilise Docker pour compiler le projet

echo "Compilation du projet ft_transcendence..."

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "Docker n'est pas installé. Veuillez l'installer avant de continuer."
    exit 1
fi

# Nettoyer les anciennes compilations si elles existent
echo "Nettoyage des anciennes compilations..."
rm -rf backend/dist frontend/dist

# Créer les répertoires de sortie
echo "Création des répertoires de sortie..."
mkdir -p backend/dist frontend/dist

# Construire l'image Docker de compilation
echo "Construction de l'image Docker de compilation..."
docker build -t ft_trans_build -f docker/Dockerfile.build .

# Exécuter le conteneur pour copier les fichiers compilés
echo "Exécution du conteneur de compilation..."
docker run --rm -v "$(pwd)/backend/dist:/output/backend/dist" -v "$(pwd)/frontend/dist:/output/frontend/dist" ft_trans_build

# Vérifier si les fichiers de compilation existent
if [ -d "backend/dist" ] && [ "$(find backend/dist -type f 2>/dev/null | wc -l)" -gt 0 ]; then
    echo "Compilation terminée avec succès!"
    echo "Vous pouvez maintenant lancer l'application avec './start.sh'"
else
    echo "La compilation a échoué. Veuillez vérifier les erreurs ci-dessus."
fi
