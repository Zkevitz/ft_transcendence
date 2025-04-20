# Dockerfile pour le frontend
# Multi-stage build pour optimiser la taille de l'image

# Étape de build
FROM node:18 AS build

WORKDIR /app

# Copie des fichiers de dépendances et sources
COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./
COPY vite.config.* ./
COPY tailwind.config.* ./
COPY postcss.config.* ./
COPY index.html ./
COPY src ./src
COPY src/styles ./src/styles

# Installation des dépendances
RUN npm install

# Build Vite (génère le dossier dist)
RUN npm run build

# Étape de production
FROM node:18 AS prod

WORKDIR /app

# Installer uniquement les dépendances nécessaires à l'exécution
COPY package.json ./
COPY package-lock.json ./
RUN npm install --omit=dev

# Copier les fichiers générés
COPY --from=build /app/dist ./dist
COPY server.js ./server.js
COPY server.crt ./server.crt
COPY server.key ./server.key

# Exposer le port utilisé par Fastify
EXPOSE 3000

# Commande de démarrage
CMD ["node", "server.js"]
