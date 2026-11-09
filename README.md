# ft_transcendence
 
Dernier projet du tronc commun de l'école 42 : une application web de **Pong** en temps réel, avec comptes utilisateurs, amis, chat et tournois.
 
## Fonctionnalités
 
- **Pong en temps réel** via WebSocket, contre un autre joueur ou contre une IA
- **Tournois** (jusqu'à 64 joueurs) : classiques, contre l'IA ou depuis le terminal
- **Client CLI** pour jouer en ligne de commande
- **Authentification** : inscription/connexion, OAuth Google, JWT en cookie, 2FA par code envoyé par e-mail
- **Social** : profils avec avatar et statistiques, demandes d'amis, blocage, statut en ligne
- **Chat** privé en temps réel (WebSocket)
## Stack
 
| Partie   | Technologies                                         |
|----------|------------------------------------------------------|
| Frontend | TypeScript (SPA sans framework), Vite, Tailwind CSS  |
| Backend  | Node.js, Fastify, WebSocket, SQLite                  |
| Infra    | Docker / Docker Compose, PM2, HTTPS                  |
 
## Prérequis
 
- Docker et Docker Compose
- Node.js 22 et npm (pour les scripts et le client CLI)
- Un certificat TLS (`server.key` / `server.crt`)
- Un fichier `.env`
## Configuration
 
`setup.sh` crée des liens vers `~/Desktop/.env` et `~/Desktop/certs`. Tu peux aussi placer ces fichiers directement à la racine du projet.
 
**`.env`**
 
```env
JWTS=                # secret de signature des JWT
CLIENT_ID=           # OAuth Google
CLIENT_SECRET=       # OAuth Google
EMAIL_USER=          # compte d'envoi des codes 2FA
EMAIL_PASS=          # mot de passe d'application
EMAIL_REMEMBER=
```
 
**Certificat auto-signé**
 
```bash
mkdir certs
openssl req -x509 -newkey rsa:2048 -nodes -days 365 \
  -keyout certs/server.key -out certs/server.crt -subj "/CN=localhost"
```
 
## Lancement
 
```bash
npm run dev      # développement (hot reload)
npm run prod     # production (build optimisé)
npm run redev    # ou reprod : rebuild de l'image
```
 
| Service  | URL                    |
|----------|------------------------|
| Frontend | https://localhost:3001 |
| API      | https://localhost:3000 |
 
**Client terminal**
 
```bash
npm install
npm run cli      # commandes : help, rules, play, start, score, status, history
```
 
**Nettoyage complet**
 
```bash
npm run nuke     # supprime .env, certs et toutes les ressources Docker
```
 
> ⚠️ `nuke` lance `docker system prune -af --volumes` : cela supprime **toutes** les images et volumes Docker de la machine, pas seulement ceux du projet.
 
## Structure
 
```
src/
├── backend/
│   ├── server.ts          # point d'entrée Fastify (plugins, OAuth, routes)
│   ├── db/                # base SQLite (générée au lancement)
│   └── src/
│       ├── database.ts    # schéma et connexion
│       ├── Routes/        # API REST + WebSocket (users, pong, chat)
│       └── services/      # logique métier (users, amis, tournois, chat, e-mail)
└── frontend/
    ├── index.html
    ├── server.ts          # serveur statique (prod)
    ├── cliPong.js         # client terminal
    └── src/
        ├── router.ts      # routage SPA
        ├── pages/         # vues (login, jeu, profil, tournoi, chat…)
        └── API/           # appels HTTP, auth, WebSocket
```
 
## API (aperçu)
 
Toutes les routes sont préfixées par `/api`.
 
| Domaine  | Exemples                                                         |
|----------|------------------------------------------------------------------|
| Auth     | `POST /register`, `POST /login`, `GET /login/google`, `GET /refreshToken` |
| Users    | `GET /users/:id`, `GET /users/:id/stats`, `POST /updateUser/:id` |
| Amis     | `GET /friends/:id`, `POST /AddFriend/:id`, `POST /removeFriend/:id` |
| Tournois | `GET /tournament/current/:type`, `POST /tournament/updateStatus` |
| Temps réel | `WS /ws/game`, `WS /ws/chat`                                   |


### S/o
projet realisé en trio avec 2 autres etudiant de l'ecole 42