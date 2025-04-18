/**
 * Routes API pour la gestion des tournois
 *
 * Ce fichier définit les endpoints API pour :
 * - Création et gestion des tournois
 * - Inscription des joueurs aux tournois
 * - Gestion des matchs de tournoi
 *
 * Ces routes utilisent le service de tournoi pour interagir avec la base de données.
 */
import { FastifyInstance } from 'fastify';
/**
 * Enregistre les routes de tournoi dans l'application Fastify
 * @param fastify - Instance Fastify
 */
export default function tournamentRoutes(fastify: FastifyInstance): Promise<void>;
