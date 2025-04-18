# Dockerfile pour le frontend
# 
# Ce fichier définit les étapes pour construire l'image Docker du frontend.
# Il utilise une approche multi-stage pour optimiser la taille de l'image finale.

# Étape de build
FROM node:16 AS build

# Répertoire de travail
WORKDIR /app

# Copie des fichiers de dépendances
COPY package.json ./

# Installation des dépendances
RUN npm install

# Copie du code source
COPY . .

# Création du répertoire dist et copie du fichier HTML statique
RUN mkdir -p dist && \
    cp static-index.html dist/index.html

# Étape de production
FROM nginx:alpine

# Création d'une configuration Nginx par défaut
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
    location /api { \
        proxy_pass http://backend:3000; \
        proxy_http_version 1.1; \
        proxy_set_header Upgrade $http_upgrade; \
        proxy_set_header Connection "upgrade"; \
        proxy_set_header Host $host; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Copie des fichiers de build depuis l'étape précédente
COPY --from=build /app/dist /usr/share/nginx/html

# Exposition du port
EXPOSE 80

# Commande de démarrage
CMD ["nginx", "-g", "daemon off;"]
