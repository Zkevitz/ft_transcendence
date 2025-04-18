"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const websocket_1 = __importDefault(require("@fastify/websocket"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
// Configuration de l'environnement
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'; // À remplacer par une variable d'environnement sécurisée
// Création de l'instance Fastify
const server = (0, fastify_1.default)({
    logger: true,
});
// Enregistrement des plugins
async function registerPlugins() {
    // CORS pour permettre les requêtes cross-origin
    await server.register(cors_1.default, {
        origin: true, // Autorise toutes les origines en développement
    });
    // WebSocket pour les communications en temps réel
    await server.register(websocket_1.default);
    // JWT pour l'authentification
    await server.register(jwt_1.default, {
        secret: JWT_SECRET,
    });
}
// Enregistrement des routes
async function registerRoutes() {
    // Enregistrement des routes avec le préfixe /api
    server.register(async (fastify) => {
        // Route de base pour tester l'API
        fastify.get('/', async (request, reply) => {
            return { message: 'Bienvenue sur l\'API de ft_transcendence!' };
        });
        // Route de santé pour vérifier que le serveur fonctionne
        fastify.get('/health', async (request, reply) => {
            return { status: 'ok' };
        });
    }, { prefix: '/api' });
    // Ici, nous ajouterons plus tard d'autres routes pour les fonctionnalités du jeu
}
// Fonction principale pour démarrer le serveur
async function start() {
    try {
        // Enregistrement des plugins et des routes
        await registerPlugins();
        await registerRoutes();
        // Démarrage du serveur
        await server.listen({ port: Number(PORT), host: HOST });
        console.log(`Serveur démarré sur ${HOST}:${PORT}`);
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}
// Démarrage du serveur
start();
