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

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { 
  createTournament, 
  getTournamentById, 
  getAllTournaments, 
  registerPlayerToTournament, 
  unregisterPlayerFromTournament,
  getTournamentParticipants,
  startTournament,
  getTournamentMatches,
  startTournamentMatch,
  endTournamentMatch
} from '../services/tournamentService';

// Types pour les paramètres de requête
interface TournamentIdParam {
  Params: {
    id: string;
  }
}

interface CreateTournamentRequest {
  Body: {
    name: string;
    description?: string;
    start_date: string;
    max_players: number;
  }
}

interface RegisterPlayerRequest {
  Params: {
    id: string;
  },
  Body: {
    playerId: number;
  }
}

interface MatchIdParam {
  Params: {
    id: string;
    matchId: string;
  }
}

interface UpdateMatchRequest {
  Params: {
    id: string;
    matchId: string;
  },
  Body: {
    player1_score: number;
    player2_score: number;
    status: string;
    winnerId?: number;
  }
}

/**
 * Enregistre les routes de tournoi dans l'application Fastify
 * @param fastify - Instance Fastify
 */
export default async function tournamentRoutes(fastify: FastifyInstance) {
  // Middleware pour vérifier l'authentification
  const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: 'Non authentifié' });
    }
  };

  // Route pour créer un tournoi
  fastify.post('/tournaments', { onRequest: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { name, description, start_date, max_players } = request.body as CreateTournamentRequest['Body'];
      const organizer_id = (request.user as any).id;
      
      // Validation des données
      if (!name || !max_players) {
        return reply.code(400).send({ error: 'Le nom et le nombre maximum de joueurs sont requis' });
      }
      
      if (max_players < 2) {
        return reply.code(400).send({ error: 'Le nombre maximum de joueurs doit être au moins 2' });
      }
      
      // Création du tournoi
      const tournamentId = await createTournament({ name, organizer_id, max_players });
      
      // Récupération du tournoi créé
      const tournament = await getTournamentById(tournamentId);
      
      reply.code(201).send({ tournament });
    } catch (err) {
      reply.code(500).send({ error: 'Erreur lors de la création du tournoi' });
    }
  });

  // Route pour récupérer un tournoi par son ID
  fastify.get('/tournaments/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const tournamentId = parseInt((request.params as TournamentIdParam['Params']).id);
      
      // Récupération du tournoi
      const tournament = await getTournamentById(tournamentId);
      
      if (!tournament) {
        return reply.code(404).send({ error: 'Tournoi non trouvé' });
      }
      
      reply.send({ tournament });
    } catch (err) {
      reply.code(500).send({ error: 'Erreur lors de la récupération du tournoi' });
    }
  });

  // Route pour récupérer tous les tournois
  fastify.get('/tournaments', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const tournaments = await getAllTournaments();
      
      reply.send({ tournaments });
    } catch (err) {
      reply.code(500).send({ error: 'Erreur lors de la récupération des tournois' });
    }
  });

  // Route pour inscrire un joueur à un tournoi
  fastify.post('/tournaments/:id/register', { onRequest: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const tournamentId = parseInt((request.params as RegisterPlayerRequest['Params']).id);
      const playerId = (request.user as any).id; // Le joueur qui s'inscrit est l'utilisateur authentifié
      
      // Inscription du joueur
      const success = await registerPlayerToTournament(tournamentId, playerId);
      
      if (!success) {
        return reply.code(400).send({ error: 'Erreur lors de l\'inscription au tournoi' });
      }
      
      reply.send({ success: true, message: 'Inscription au tournoi réussie' });
    } catch (err) {
      reply.code(500).send({ error: 'Erreur lors de l\'inscription au tournoi' });
    }
  });

  // Route pour désinscrire un joueur d'un tournoi
  fastify.delete('/tournaments/:id/register', { onRequest: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const tournamentId = parseInt((request.params as RegisterPlayerRequest['Params']).id);
      const playerId = (request.user as any).id; // Le joueur qui se désinscrit est l'utilisateur authentifié
      
      // Désinscription du joueur
      const success = await unregisterPlayerFromTournament(tournamentId, playerId);
      
      if (!success) {
        return reply.code(400).send({ error: 'Erreur lors de la désinscription du tournoi' });
      }
      
      reply.send({ success: true, message: 'Désinscription du tournoi réussie' });
    } catch (err) {
      reply.code(500).send({ error: 'Erreur lors de la désinscription du tournoi' });
    }
  });

  // Route pour récupérer les participants d'un tournoi
  fastify.get('/tournaments/:id/participants', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const tournamentId = parseInt((request.params as TournamentIdParam['Params']).id);
      
      // Récupération des participants
      const participants = await getTournamentParticipants(tournamentId);
      
      reply.send({ participants });
    } catch (err) {
      reply.code(500).send({ error: 'Erreur lors de la récupération des participants' });
    }
  });

  // Route pour démarrer un tournoi
  fastify.put('/tournaments/:id/start', { onRequest: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const tournamentId = parseInt((request.params as TournamentIdParam['Params']).id);
      const userId = (request.user as any).id;
      
      // Vérification que l'utilisateur est l'organisateur
      const tournament = await getTournamentById(tournamentId);
      if (!tournament) {
        return reply.code(404).send({ error: 'Tournoi non trouvé' });
      }
      
      if (tournament.organizer_id !== userId) {
        return reply.code(403).send({ error: 'Seul l\'organisateur peut démarrer le tournoi' });
      }
      
      // Démarrage du tournoi
      const success = await startTournament(tournamentId);
      
      if (!success) {
        return reply.code(400).send({ error: 'Erreur lors du démarrage du tournoi' });
      }
      
      reply.send({ success: true, message: 'Tournoi démarré avec succès' });
    } catch (err) {
      reply.code(500).send({ error: 'Erreur lors du démarrage du tournoi' });
    }
  });

  // Route pour récupérer les matchs d'un tournoi
  fastify.get('/tournaments/:id/matches', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const tournamentId = parseInt((request.params as TournamentIdParam['Params']).id);
      
      // Récupération des matchs
      const matches = await getTournamentMatches(tournamentId);
      
      reply.send({ matches });
    } catch (err) {
      reply.code(500).send({ error: 'Erreur lors de la récupération des matchs' });
    }
  });

  // Route pour démarrer un match de tournoi
  fastify.post('/tournaments/:id/matches/:matchId/start', { onRequest: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const tournamentId = parseInt((request.params as MatchIdParam['Params']).id);
      const matchId = parseInt((request.params as MatchIdParam['Params']).matchId);
      const userId = (request.user as any).id;
      
      // Vérification que l'utilisateur est l'organisateur
      const tournament = await getTournamentById(tournamentId);
      if (!tournament) {
        return reply.code(404).send({ error: 'Tournoi non trouvé' });
      }
      
      if (tournament.organizer_id !== userId) {
        return reply.code(403).send({ error: 'Seul l\'organisateur peut démarrer un match' });
      }
      
      // Démarrage du match
      const gameId = await startTournamentMatch(matchId);
      
      if (!gameId) {
        return reply.code(400).send({ error: 'Erreur lors du démarrage du match' });
      }
      
      reply.send({ success: true, gameId, message: 'Match démarré avec succès' });
    } catch (err) {
      reply.code(500).send({ error: 'Erreur lors du démarrage du match' });
    }
  });

  // Route pour terminer un match de tournoi
  fastify.post('/tournaments/:id/matches/:matchId/end', { onRequest: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const tournamentId = parseInt((request.params as MatchIdParam['Params']).id);
      const matchId = parseInt((request.params as MatchIdParam['Params']).matchId);
      const { winnerId } = request.body as UpdateMatchRequest['Body'];
      const userId = (request.user as any).id;
      
      // Validation des données
      if (!winnerId) {
        return reply.code(400).send({ error: 'L\'ID du gagnant est requis' });
      }
      
      // Vérification que l'utilisateur est l'organisateur
      const tournament = await getTournamentById(tournamentId);
      if (!tournament) {
        return reply.code(404).send({ error: 'Tournoi non trouvé' });
      }
      
      if (tournament.organizer_id !== userId) {
        return reply.code(403).send({ error: 'Seul l\'organisateur peut terminer un match' });
      }
      
      // Terminer le match
      const success = await endTournamentMatch(matchId, winnerId);
      
      if (!success) {
        return reply.code(400).send({ error: 'Erreur lors de la terminaison du match' });
      }
      
      reply.send({ success: true, message: 'Match terminé avec succès' });
    } catch (err) {
      reply.code(500).send({ error: 'Erreur lors de la terminaison du match' });
    }
  });
}
