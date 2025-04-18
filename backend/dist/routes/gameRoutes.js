"use strict";
/**
 * Routes API pour la gestion des parties de Pong
 *
 * Ce fichier définit les endpoints API pour :
 * - Création et gestion des parties de Pong
 * - Mise à jour des scores
 * - Récupération de l'historique des parties
 *
 * Ces routes utilisent le service de jeu pour interagir avec la base de données.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = gameRoutes;
const gameService_1 = require("../services/gameService");
/**
 * Enregistre les routes de jeu dans l'application Fastify
 * @param fastify - Instance Fastify
 */
async function gameRoutes(fastify) {
    // Middleware pour vérifier l'authentification
    const authenticate = async (request, reply) => {
        try {
            await request.jwtVerify();
        }
        catch (err) {
            reply.code(401).send({ error: 'Non authentifié' });
        }
    };
    // Route pour créer une nouvelle partie
    fastify.post('/games', { onRequest: [authenticate] }, async (request, reply) => {
        try {
            const player1_id = request.user.id;
            const { player2_id, tournament_id } = request.body;
            // Validation des données
            if (!player2_id) {
                return reply.code(400).send({ error: 'L\'ID du deuxième joueur est requis' });
            }
            // Création de la partie
            const gameId = await (0, gameService_1.createGame)({ player1_id, player2_id, tournament_id });
            // Récupération de la partie créée
            const game = await (0, gameService_1.getGameById)(gameId);
            reply.code(201).send({ game });
        }
        catch (err) {
            reply.code(500).send({ error: 'Erreur lors de la création de la partie' });
        }
    });
    // Route pour récupérer toutes les parties
    fastify.get('/games', async (request, reply) => {
        try {
            const games = await (0, gameService_1.getAllGames)();
            reply.send({ games });
        }
        catch (err) {
            reply.code(500).send({ error: 'Erreur lors de la récupération des parties' });
        }
    });
    // Route pour récupérer une partie par son ID
    fastify.get('/games/:id', async (request, reply) => {
        try {
            const gameId = parseInt(request.params.id);
            // Récupération de la partie
            const game = await (0, gameService_1.getGameById)(gameId);
            if (!game) {
                return reply.code(404).send({ error: 'Partie non trouvée' });
            }
            reply.send({ game });
        }
        catch (err) {
            reply.code(500).send({ error: 'Erreur lors de la récupération de la partie' });
        }
    });
    // Route pour mettre à jour une partie
    fastify.put('/games/:id', { onRequest: [authenticate] }, async (request, reply) => {
        try {
            const gameId = parseInt(request.params.id);
            const { player1_score, player2_score, status } = request.body;
            // Validation des données
            if (player1_score === undefined && player2_score === undefined && status === undefined) {
                return reply.code(400).send({ error: 'Au moins un score ou un statut doit être fourni' });
            }
            // Mise à jour de la partie
            const success = await (0, gameService_1.updateGameScore)(gameId, { player1_score, player2_score });
            if (!success) {
                return reply.code(404).send({ error: 'Partie non trouvée' });
            }
            // Récupération de la partie mise à jour
            const game = await (0, gameService_1.getGameById)(gameId);
            reply.send({ game });
        }
        catch (err) {
            reply.code(500).send({ error: 'Erreur lors de la mise à jour de la partie' });
        }
    });
    // Route pour mettre à jour le score d'une partie
    fastify.put('/games/:id/score', { onRequest: [authenticate] }, async (request, reply) => {
        try {
            const gameId = parseInt(request.params.id);
            const { player1_score, player2_score } = request.body;
            // Validation des données
            if (player1_score === undefined && player2_score === undefined) {
                return reply.code(400).send({ error: 'Au moins un score doit être fourni' });
            }
            // Mise à jour du score
            const success = await (0, gameService_1.updateGameScore)(gameId, { player1_score, player2_score });
            if (!success) {
                return reply.code(404).send({ error: 'Partie non trouvée' });
            }
            // Récupération de la partie mise à jour
            const game = await (0, gameService_1.getGameById)(gameId);
            reply.send({ game });
        }
        catch (err) {
            reply.code(500).send({ error: 'Erreur lors de la mise à jour du score' });
        }
    });
    // Route pour terminer une partie
    fastify.put('/games/:id/end', { onRequest: [authenticate] }, async (request, reply) => {
        try {
            const gameId = parseInt(request.params.id);
            const { winner_id } = request.body;
            // Validation des données
            if (!winner_id) {
                return reply.code(400).send({ error: 'L\'ID du gagnant est requis' });
            }
            // Fin de la partie
            const success = await (0, gameService_1.endGame)(gameId, winner_id);
            if (!success) {
                return reply.code(404).send({ error: 'Partie non trouvée' });
            }
            // Récupération de la partie mise à jour
            const game = await (0, gameService_1.getGameById)(gameId);
            reply.send({ game });
        }
        catch (err) {
            reply.code(500).send({ error: 'Erreur lors de la fin de la partie' });
        }
    });
    // Route pour récupérer l'historique des parties d'un utilisateur
    fastify.get('/users/:id/games', async (request, reply) => {
        try {
            const userId = parseInt(request.params.id);
            const limit = request.query.limit ? parseInt(request.query.limit) : 10;
            const offset = request.query.offset ? parseInt(request.query.offset) : 0;
            // Récupération des parties
            const games = await (0, gameService_1.getUserGames)(userId, limit, offset);
            reply.send({ games });
        }
        catch (err) {
            reply.code(500).send({ error: 'Erreur lors de la récupération des parties' });
        }
    });
    // Route pour récupérer les statistiques d'un joueur
    fastify.get('/users/:id/stats', async (request, reply) => {
        try {
            const userId = parseInt(request.params.id);
            // Récupération des statistiques
            const stats = await (0, gameService_1.getPlayerStats)(userId);
            reply.send({ stats });
        }
        catch (err) {
            reply.code(500).send({ error: 'Erreur lors de la récupération des statistiques' });
        }
    });
}
