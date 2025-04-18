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
import { FastifyInstance } from 'fastify';
/**
 * Enregistre les routes utilisateur dans l'application Fastify
 * @param fastify - Instance Fastify
 */
export default function userRoutes(fastify: FastifyInstance): Promise<void>;
