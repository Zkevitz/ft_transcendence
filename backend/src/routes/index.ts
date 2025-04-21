/**
 * Configuration des routes API
 * 
 * Ce fichier regroupe toutes les routes API de l'application et les enregistre
 * dans l'instance Fastify.
 */

import { FastifyInstance } from 'fastify';
import userRoutes from './userRoutes';
import gameRoutes from './gameRoutes';
import tournamentRoutes from './tournamentRoutes';

/**
 * Enregistre toutes les routes API dans l'application Fastify
 * @param fastify - Instance Fastify
 */
export default async function routes(fastify: FastifyInstance) {
  // Préfixe pour toutes les routes API
  fastify.register(async (instance) => {
    // Enregistrement des routes utilisateur
    await instance.register(userRoutes);
    
    // Enregistrement des routes de jeu
    await instance.register(gameRoutes);
    
    // Enregistrement des routes de tournoi
    await instance.register(tournamentRoutes);
  }, { prefix: '/api' });
  
  // Route racine pour vérifier que l'API fonctionne
  fastify.get('/', async (request, reply) => {
    reply.send({ message: 'Bienvenue sur l\'API de ft_transcendence! deuxieme modif' });
    reply.send({message : 'Ceci est un test de modication de l api'});
  });
}
