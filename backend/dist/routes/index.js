"use strict";
/**
 * Configuration des routes API
 *
 * Ce fichier regroupe toutes les routes API de l'application et les enregistre
 * dans l'instance Fastify.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = routes;
const userRoutes_1 = __importDefault(require("./userRoutes"));
const gameRoutes_1 = __importDefault(require("./gameRoutes"));
const tournamentRoutes_1 = __importDefault(require("./tournamentRoutes"));
/**
 * Enregistre toutes les routes API dans l'application Fastify
 * @param fastify - Instance Fastify
 */
async function routes(fastify) {
    // Préfixe pour toutes les routes API
    fastify.register(async (instance) => {
        // Enregistrement des routes utilisateur
        await instance.register(userRoutes_1.default);
        // Enregistrement des routes de jeu
        await instance.register(gameRoutes_1.default);
        // Enregistrement des routes de tournoi
        await instance.register(tournamentRoutes_1.default);
    }, { prefix: '/api' });
    // Route racine pour vérifier que l'API fonctionne
    fastify.get('/', async (request, reply) => {
        reply.send({ message: 'Bienvenue sur l\'API de ft_transcendence! deuxieme modif' });
    });
}
