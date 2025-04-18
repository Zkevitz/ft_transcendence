"use strict";
/**
 * Routes API pour la gestion des utilisateurs
 *
 * Ce fichier définit les endpoints API pour :
 * - Inscription et connexion des utilisateurs
 * - Gestion des profils utilisateurs
 * - Gestion des relations d'amitié
 *
 * Ces routes utilisent le service utilisateur pour interagir avec la base de données.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userRoutes;
const userService_1 = require("../services/userService");
const gameService_1 = require("../services/gameService");
/**
 * Enregistre les routes utilisateur dans l'application Fastify
 * @param fastify - Instance Fastify
 */
async function userRoutes(fastify) {
    // Middleware pour vérifier l'authentification
    const authenticate = async (request, reply) => {
        try {
            await request.jwtVerify();
        }
        catch (err) {
            reply.code(401).send({ error: 'Non authentifié' });
        }
    };
    // Route d'inscription
    fastify.post('/register', async (request, reply) => {
        try {
            const { username, email, password, avatar_url } = request.body;
            // Validation des données
            if (!username || !email || !password) {
                return reply.code(400).send({ error: 'Tous les champs obligatoires doivent être remplis' });
            }
            // Création de l'utilisateur
            const userId = await (0, userService_1.createUser)({ username, email, password, avatar_url });
            // Récupération de l'utilisateur créé
            const user = await (0, userService_1.getUserById)(userId);
            // Génération du token JWT
            const token = fastify.jwt.sign({ id: userId }, { expiresIn: '1d' });
            reply.code(201).send({ user, token });
        }
        catch (err) {
            // Gestion des erreurs de contrainte unique (email ou username déjà utilisés)
            if (err.message.includes('UNIQUE constraint failed')) {
                if (err.message.includes('email')) {
                    return reply.code(400).send({ error: 'Cet email est déjà utilisé' });
                }
                if (err.message.includes('username')) {
                    return reply.code(400).send({ error: 'Ce nom d\'utilisateur est déjà utilisé' });
                }
            }
            reply.code(500).send({ error: 'Erreur lors de l\'inscription' });
        }
    });
    // Route de connexion
    fastify.post('/login', async (request, reply) => {
        try {
            const { email, password } = request.body;
            // Validation des données
            if (!email || !password) {
                return reply.code(400).send({ error: 'Email et mot de passe requis' });
            }
            // Authentification de l'utilisateur
            const user = await (0, userService_1.authenticateUser)(email, password);
            if (!user) {
                return reply.code(401).send({ error: 'Email ou mot de passe incorrect' });
            }
            // Génération du token JWT
            const token = fastify.jwt.sign({ id: user.id }, { expiresIn: '1d' });
            reply.send({ user, token });
        }
        catch (err) {
            reply.code(500).send({ error: 'Erreur lors de la connexion' });
        }
    });
    // Route pour récupérer le profil de l'utilisateur connecté
    fastify.get('/me', { onRequest: [authenticate] }, async (request, reply) => {
        try {
            const userId = request.user.id;
            // Récupération de l'utilisateur
            const user = await (0, userService_1.getUserById)(userId);
            if (!user) {
                return reply.code(404).send({ error: 'Utilisateur non trouvé' });
            }
            // Récupération des statistiques du joueur
            const stats = await (0, gameService_1.getPlayerStats)(userId);
            reply.send({ user, stats });
        }
        catch (err) {
            reply.code(500).send({ error: 'Erreur lors de la récupération du profil' });
        }
    });
    // Route pour récupérer un utilisateur par son ID
    fastify.get('/users/:id', async (request, reply) => {
        try {
            const userId = parseInt(request.params.id);
            // Récupération de l'utilisateur
            const user = await (0, userService_1.getUserById)(userId);
            if (!user) {
                return reply.code(404).send({ error: 'Utilisateur non trouvé' });
            }
            // Récupération des statistiques du joueur
            const stats = await (0, gameService_1.getPlayerStats)(userId);
            reply.send({ user, stats });
        }
        catch (err) {
            reply.code(500).send({ error: 'Erreur lors de la récupération de l\'utilisateur' });
        }
    });
    // Route pour mettre à jour un utilisateur
    fastify.put('/users/:id', { onRequest: [authenticate] }, async (request, reply) => {
        try {
            const userId = parseInt(request.params.id);
            const authUserId = request.user.id;
            // Vérification que l'utilisateur modifie son propre profil
            if (userId !== authUserId) {
                return reply.code(403).send({ error: 'Non autorisé à modifier ce profil' });
            }
            const userData = request.body;
            // Mise à jour de l'utilisateur
            const success = await (0, userService_1.updateUser)(userId, userData);
            if (!success) {
                return reply.code(404).send({ error: 'Utilisateur non trouvé' });
            }
            // Récupération de l'utilisateur mis à jour
            const user = await (0, userService_1.getUserById)(userId);
            reply.send({ user });
        }
        catch (err) {
            // Gestion des erreurs de contrainte unique (email ou username déjà utilisés)
            if (err.message.includes('UNIQUE constraint failed')) {
                if (err.message.includes('email')) {
                    return reply.code(400).send({ error: 'Cet email est déjà utilisé' });
                }
                if (err.message.includes('username')) {
                    return reply.code(400).send({ error: 'Ce nom d\'utilisateur est déjà utilisé' });
                }
            }
            reply.code(500).send({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
        }
    });
    // Route pour supprimer un utilisateur
    fastify.delete('/users/:id', { onRequest: [authenticate] }, async (request, reply) => {
        try {
            const userId = parseInt(request.params.id);
            const authUserId = request.user.id;
            // Vérification que l'utilisateur supprime son propre compte
            if (userId !== authUserId) {
                return reply.code(403).send({ error: 'Non autorisé à supprimer ce compte' });
            }
            // Suppression de l'utilisateur
            const success = await (0, userService_1.deleteUser)(userId);
            if (!success) {
                return reply.code(404).send({ error: 'Utilisateur non trouvé' });
            }
            reply.send({ success: true, message: 'Utilisateur supprimé avec succès' });
        }
        catch (err) {
            reply.code(500).send({ error: 'Erreur lors de la suppression de l\'utilisateur' });
        }
    });
    // Route pour récupérer les amis d'un utilisateur
    fastify.get('/users/:id/friends', async (request, reply) => {
        try {
            const userId = parseInt(request.params.id);
            // Récupération des amis
            const friends = await (0, userService_1.getUserFriends)(userId);
            reply.send({ friends });
        }
        catch (err) {
            reply.code(500).send({ error: 'Erreur lors de la récupération des amis' });
        }
    });
    // Route pour ajouter un ami
    fastify.post('/users/:id/friends', { onRequest: [authenticate] }, async (request, reply) => {
        try {
            const userId = parseInt(request.params.id);
            const authUserId = request.user.id;
            const friendId = request.body.friendId;
            // Vérification que l'utilisateur ajoute un ami à son propre compte
            if (userId !== authUserId) {
                return reply.code(403).send({ error: 'Non autorisé à ajouter un ami à ce compte' });
            }
            // Vérification que l'utilisateur n'essaie pas de s'ajouter lui-même
            if (userId === friendId) {
                return reply.code(400).send({ error: 'Vous ne pouvez pas vous ajouter vous-même comme ami' });
            }
            // Ajout de l'ami
            const success = await (0, userService_1.addFriend)(userId, friendId);
            if (!success) {
                return reply.code(400).send({ error: 'Erreur lors de l\'ajout de l\'ami' });
            }
            reply.send({ success: true, message: 'Demande d\'ami envoyée avec succès' });
        }
        catch (err) {
            reply.code(500).send({ error: 'Erreur lors de l\'ajout de l\'ami' });
        }
    });
    // Route pour accepter une demande d'ami
    fastify.put('/users/:id/friends/accept', { onRequest: [authenticate] }, async (request, reply) => {
        try {
            const userId = parseInt(request.params.id);
            const authUserId = request.user.id;
            const friendId = request.body.friendId;
            // Vérification que l'utilisateur accepte une demande d'ami pour son propre compte
            if (userId !== authUserId) {
                return reply.code(403).send({ error: 'Non autorisé à accepter une demande d\'ami pour ce compte' });
            }
            // Acceptation de la demande d'ami
            const success = await (0, userService_1.acceptFriendRequest)(userId, friendId);
            if (!success) {
                return reply.code(400).send({ error: 'Erreur lors de l\'acceptation de la demande d\'ami' });
            }
            reply.send({ success: true, message: 'Demande d\'ami acceptée avec succès' });
        }
        catch (err) {
            reply.code(500).send({ error: 'Erreur lors de l\'acceptation de la demande d\'ami' });
        }
    });
    // Route pour rejeter une demande d'ami
    fastify.put('/users/:id/friends/reject', { onRequest: [authenticate] }, async (request, reply) => {
        try {
            const userId = parseInt(request.params.id);
            const authUserId = request.user.id;
            const friendId = request.body.friendId;
            // Vérification que l'utilisateur rejette une demande d'ami pour son propre compte
            if (userId !== authUserId) {
                return reply.code(403).send({ error: 'Non autorisé à rejeter une demande d\'ami pour ce compte' });
            }
            // Rejet de la demande d'ami
            const success = await (0, userService_1.rejectFriendRequest)(userId, friendId);
            if (!success) {
                return reply.code(400).send({ error: 'Erreur lors du rejet de la demande d\'ami' });
            }
            reply.send({ success: true, message: 'Demande d\'ami rejetée avec succès' });
        }
        catch (err) {
            reply.code(500).send({ error: 'Erreur lors du rejet de la demande d\'ami' });
        }
    });
    // Route pour supprimer un ami
    fastify.delete('/users/:id/friends/:friendId', { onRequest: [authenticate] }, async (request, reply) => {
        try {
            const userId = parseInt(request.params.id);
            const friendId = parseInt(request.params.friendId);
            const authUserId = request.user.id;
            // Vérification que l'utilisateur supprime un ami de son propre compte
            if (userId !== authUserId) {
                return reply.code(403).send({ error: 'Non autorisé à supprimer un ami de ce compte' });
            }
            // Suppression de l'ami
            const success = await (0, userService_1.removeFriend)(userId, friendId);
            if (!success) {
                return reply.code(400).send({ error: 'Erreur lors de la suppression de l\'ami' });
            }
            reply.send({ success: true, message: 'Ami supprimé avec succès' });
        }
        catch (err) {
            reply.code(500).send({ error: 'Erreur lors de la suppression de l\'ami' });
        }
    });
}
