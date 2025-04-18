# ft_transcendence

## Description
Ce projet consiste à créer un site web permettant de jouer au jeu Pong en ligne avec d'autres joueurs. Le site offre une interface utilisateur avec des capacités multijoueur en temps réel, un système de tournoi et de matchmaking.

## Fonctionnalités
- **Jeu de Pong** : Jouez au Pong en ligne contre d'autres joueurs en temps réel
- **Système de tournoi** : Créez et participez à des tournois avec d'autres joueurs
- **Gestion des utilisateurs** : Inscription, connexion, profil avec statistiques et avatar
- **Système d'amis** : Ajoutez des amis et suivez leur statut en ligne
- **Historique des parties** : Consultez l'historique de vos parties et vos statistiques

## Technologies utilisées
- **Frontend** : TypeScript, Tailwind CSS
- **Backend** : Fastify avec Node.js
- **Base de données** : SQLite
- **Conteneurisation** : Docker
- **Sécurité** : HTTPS, JWT, bcrypt pour le hachage des mots de passe

## Structure du projet
```
ft_transcendence/
├── frontend/       # Code source du frontend (TypeScript, Tailwind CSS)
├── backend/        # Code source du backend (Fastify avec Node.js)
├── docker/         # Configuration Docker pour le déploiement
└── .env.example    # Exemple de variables d'environnement
```

## Prérequis
- Docker et Docker Compose
- Node.js (pour le développement local)
- Un navigateur web moderne (Mozilla Firefox recommandé)

## Installation et démarrage

### Méthode simple (recommandée)
1. Clonez ce dépôt :
   ```bash
   git clone <url_du_repo> ft_transcendence
   cd ft_transcendence
   ```

2. Exécutez le script de démarrage :
   ```bash
   ./start.sh
   ```

3. Accédez à l'application dans votre navigateur :
   ```
   https://localhost
   ```

### Méthode manuelle
1. Clonez ce dépôt :
   ```bash
   git clone <url_du_repo> ft_transcendence
   cd ft_transcendence
   ```

2. Copiez le fichier d'exemple de variables d'environnement :
   ```bash
   cp .env.example .env
   ```

3. Générez des certificats SSL pour le développement :
   ```bash
   cd docker && ./generate-ssl-certs.sh && cd ..
   ```

4. Construisez et démarrez les conteneurs :
   ```bash
   docker-compose up --build -d
   ```

5. Accédez à l'application dans votre navigateur :
   ```
   https://localhost
   ```

## Développement

### Structure du frontend
- `frontend/src/components/` : Composants réutilisables
- `frontend/src/pages/` : Pages de l'application
- `frontend/src/game/` : Logique du jeu Pong
- `frontend/src/styles/` : Styles CSS et configuration Tailwind

### Structure du backend
- `backend/src/routes/` : Routes API
- `backend/src/services/` : Services métier
- `backend/src/models/` : Modèles de données
- `backend/src/plugins/` : Plugins Fastify

### Commandes utiles
- Démarrer l'application : `./start.sh`
- Arrêter l'application : `docker-compose down`
- Voir les logs : `docker-compose logs -f`

## Sécurité
- Toutes les communications sont chiffrées via HTTPS
- Les mots de passe sont hachés avec bcrypt
- L'authentification utilise des tokens JWT
- Protection contre les injections SQL et les attaques XSS

## Auteurs
- [Votre nom]

## Licence
Ce projet est réalisé dans le cadre du cursus de l'école 42.
