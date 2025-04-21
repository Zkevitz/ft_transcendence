# Dockerfile pour le backend
# 
# Ce fichier définit les étapes pour construire l'image Docker du backend.
# Il utilise une approche multi-stage pour optimiser la taille de l'image finale.

# Étape de build
FROM node:16

# Répertoire de travail
WORKDIR /app

# Copie des fichiers de dépendances
COPY package.json ./

# Installation des dépendances et de ts-node
#->npm install : installe les dépendances définies dans package.json
# et créé le fichier package-lock.json et le dossier node_modules
RUN npm install && \
    npm install -g ts-node && \
    npm install -D @types/node @types/ws

# Copie du code source
COPY . .

# Exposition du port
EXPOSE 3000

# Commande de démarrage avec ts-node et ignorer les erreurs de typage
CMD ["ts-node", "--transpile-only", "src/index.ts"]
