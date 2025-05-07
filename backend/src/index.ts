import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import jwt from '@fastify/jwt';

// Configuration de l'environnement
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'; // À remplacer par une variable d'environnement sécurisée

// Création de l'instance Fastify
const server: FastifyInstance = Fastify({
  logger: true,
});


async function registerWebSocketRoutes(){
  const clients = new Set<import('ws').WebSocket>();

server.get('/ws/chat', { websocket: true }, (connection, req) => {
  // Authentifier via JWT (dans les headers ou URL query ?)
  const token = req.headers['sec-websocket-protocol'];
  if (!token) {
    connection.socket.close();
    return;
  }

  try {
    const user = server.jwt.verify(token.toString());
    console.log(`Utilisateur connecté`);
  } catch (err) {
    console.log('JWT invalide');
    connection.socket.close();
    return;
  }

  clients.add(connection.socket);

  connection.socket.on('message', (msg) => {
    console.log('Message reçu :', msg.toString());

    // Diffuser à tous les autres clients
    for (const client of clients) {
      if (client.readyState === 1 && client !== connection.socket) {
        client.send(msg.toString());
      }
    }
  });

  connection.socket.on('close', () => {
    clients.delete(connection.socket);
    console.log('Client déconnecté');
  });
})
}

// Enregistrement des plugins
async function registerPlugins() {
  // CORS pour permettre les requêtes cross-origin
  await server.register(cors, {
    origin: true, // Autorise toutes les origines en développement
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  });

  // WebSocket pour les communications en temps réel
  await server.register(websocket);

  
  // JWT pour l'authentification
  await server.register(jwt, {
    secret: JWT_SECRET,
  });
}

// Enregistrement des routes
async function registerRoutes() {
  // Import des routes
  const routes = require('./routes').default;
  
  // Enregistrement des routes
  await server.register(routes);
  
  // Enregistrement des routes avec le préfixe /api
  server.register(async (fastify) => {
    // Route de base pour tester l'API
    fastify.get('/', async (request, reply) => {
      return { message: 'Bienvenue sur l\'API de ft_transcendence! Ceci est un test' };
    });

    fastify.get('/test', async (request, reply) => {
      return { message: 'Test' };
    });     
    // Route de santé pour vérifier que le serveur fonctionne
    fastify.get('/health', async (request, reply) => {
      return { status: 'ok' };
    });
  }, { prefix: '/api' });
}

// Fonction principale pour démarrer le serveur
async function start() {
  try {
    // Enregistrement des plugins et des routes
    await registerPlugins();
    await registerWebSocketRoutes();
    await registerRoutes();

    // Démarrage du serveur
    await server.listen({ port: Number(PORT), host: HOST });
    console.log(`Serveur démarré sur ${HOST}:${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

// Démarrage du serveur
start();
