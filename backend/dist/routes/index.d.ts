/**
 * Configuration des routes API
 *
 * Ce fichier regroupe toutes les routes API de l'application et les enregistre
 * dans l'instance Fastify.
 */
import { FastifyInstance } from 'fastify';
/**
 * Enregistre toutes les routes API dans l'application Fastify
 * @param fastify - Instance Fastify
 */
export default function routes(fastify: FastifyInstance): Promise<void>;
