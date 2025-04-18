#!/bin/bash
# Script pour générer des certificats SSL auto-signés
# 
# Ce script génère un certificat SSL auto-signé pour le développement local.
# Ne pas utiliser en production !

# Création du répertoire pour les certificats
mkdir -p ssl

# Génération d'une clé privée
openssl genrsa -out ssl/server.key 2048

# Génération d'une demande de signature de certificat (CSR)
openssl req -new -key ssl/server.key -out ssl/server.csr -subj "/C=FR/ST=Paris/L=Paris/O=42/OU=ft_transcendence/CN=localhost"

# Génération d'un certificat auto-signé
openssl x509 -req -days 365 -in ssl/server.csr -signkey ssl/server.key -out ssl/server.crt

# Suppression du fichier CSR (plus nécessaire)
rm ssl/server.csr

echo "Certificats SSL générés avec succès dans le répertoire ssl/"
