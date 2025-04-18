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
import { FastifyInstance } from 'fastify';
/**
 * Enregistre les routes de jeu dans l'application Fastify
 * @param fastify - Instance Fastify
 */
export default function gameRoutes(fastify: FastifyInstance): Promise<void>;
