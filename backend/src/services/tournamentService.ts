/**
 * Service de gestion des tournois
 * 
 * Ce service gère les opérations liées aux tournois :
 * - Création d'un tournoi
 * - Inscription des joueurs
 * - Génération des matchs
 * - Suivi de l'avancement du tournoi
 * 
 * Il implémente un système de tournoi à élimination directe.
 */

import { db } from '../models/database';
import { createGame } from './gameService';

// Interface pour les données de tournoi
export interface Tournament {
  id: number;
  name: string;
  organizer_id: number;
  max_players: number;
  status: 'registration' | 'in_progress' | 'completed';
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
}

// Interface pour la création d'un tournoi
export interface CreateTournamentData {
  name: string;
  organizer_id: number;
  max_players: number;
}

// Interface pour les participants au tournoi
export interface TournamentParticipant {
  id: number;
  tournament_id: number;
  user_id: number;
  registered_at: string;
  username?: string;  // Ajouté pour faciliter l'affichage
}

// Interface pour les matchs de tournoi
export interface TournamentMatch {
  id: number;
  tournament_id: number;
  game_id: number | null;
  round: number;
  position: number;
  player1_id: number | null;
  player2_id: number | null;
  status: 'pending' | 'in_progress' | 'completed';
  player1_username?: string;  // Ajouté pour faciliter l'affichage
  player2_username?: string;  // Ajouté pour faciliter l'affichage
}

/**
 * Crée un nouveau tournoi
 * @param tournamentData - Données du tournoi à créer
 * @returns Promise avec l'ID du tournoi créé
 */
export async function createTournament(tournamentData: CreateTournamentData): Promise<number> {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO tournaments (name, organizer_id, max_players)
      VALUES (?, ?, ?)
    `;

    db.run(
      query,
      [tournamentData.name, tournamentData.organizer_id, tournamentData.max_players],
      function (err) {
        if (err) {
          return reject(err);
        }

        resolve(this.lastID);
      }
    );
  });
}

/**
 * Récupère un tournoi par son ID
 * @param tournamentId - ID du tournoi
 * @returns Promise avec le tournoi ou null si non trouvé
 */
export async function getTournamentById(tournamentId: number): Promise<Tournament | null> {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT *
      FROM tournaments
      WHERE id = ?
    `;

    db.get(query, [tournamentId], (err, row) => {
      if (err) {
        return reject(err);
      }

      resolve(row as Tournament || null);
    });
  });
}

/**
 * Récupère tous les tournois
 * @param status - Statut des tournois à récupérer (optionnel)
 * @returns Promise avec la liste des tournois
 */
export async function getAllTournaments(status?: 'registration' | 'in_progress' | 'completed'): Promise<Tournament[]> {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT t.*, u.username as organizer_username
      FROM tournaments t
      JOIN users u ON t.organizer_id = u.id
    `;

    const params: any[] = [];

    if (status) {
      query += ' WHERE t.status = ?';
      params.push(status);
    }

    query += ' ORDER BY t.created_at DESC';

    db.all(query, params, (err, rows) => {
      if (err) {
        return reject(err);
      }

      resolve(rows as Tournament[]);
    });
  });
}

/**
 * Inscrit un joueur à un tournoi
 * @param tournamentId - ID du tournoi
 * @param userId - ID du joueur
 * @returns Promise avec succès ou échec
 */
export async function registerPlayerToTournament(tournamentId: number, userId: number): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      // Vérification que le tournoi existe et est en phase d'inscription
      const tournament = await getTournamentById(tournamentId);
      if (!tournament || tournament.status !== 'registration') {
        return resolve(false);
      }

      // Vérification que le tournoi n'est pas complet
      const participants = await getTournamentParticipants(tournamentId);
      if (participants.length >= tournament.max_players) {
        return resolve(false);
      }

      // Vérification que le joueur n'est pas déjà inscrit
      const isAlreadyRegistered = participants.some(p => p.user_id === userId);
      if (isAlreadyRegistered) {
        return resolve(true);  // Déjà inscrit, on considère que c'est un succès
      }

      // Inscription du joueur
      const query = `
        INSERT INTO tournament_participants (tournament_id, user_id)
        VALUES (?, ?)
      `;

      db.run(query, [tournamentId, userId], function (err) {
        if (err) {
          return reject(err);
        }

        resolve(this.changes > 0);
      });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Désinscrit un joueur d'un tournoi
 * @param tournamentId - ID du tournoi
 * @param userId - ID du joueur
 * @returns Promise avec succès ou échec
 */
export async function unregisterPlayerFromTournament(tournamentId: number, userId: number): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      // Vérification que le tournoi existe et est en phase d'inscription
      const tournament = await getTournamentById(tournamentId);
      if (!tournament || tournament.status !== 'registration') {
        return resolve(false);
      }

      // Désinscription du joueur
      const query = `
        DELETE FROM tournament_participants
        WHERE tournament_id = ? AND user_id = ?
      `;

      db.run(query, [tournamentId, userId], function (err) {
        if (err) {
          return reject(err);
        }

        resolve(this.changes > 0);
      });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Récupère les participants d'un tournoi
 * @param tournamentId - ID du tournoi
 * @returns Promise avec la liste des participants
 */
export async function getTournamentParticipants(tournamentId: number): Promise<TournamentParticipant[]> {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT tp.*, u.username
      FROM tournament_participants tp
      JOIN users u ON tp.user_id = u.id
      WHERE tp.tournament_id = ?
      ORDER BY tp.registered_at
    `;

    db.all(query, [tournamentId], (err, rows) => {
      if (err) {
        return reject(err);
      }

      resolve(rows as TournamentParticipant[]);
    });
  });
}

/**
 * Démarre un tournoi
 * @param tournamentId - ID du tournoi
 * @returns Promise avec succès ou échec
 */
export async function startTournament(tournamentId: number): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      // Vérification que le tournoi existe et est en phase d'inscription
      const tournament = await getTournamentById(tournamentId);
      if (!tournament || tournament.status !== 'registration') {
        return resolve(false);
      }

      // Récupération des participants
      const participants = await getTournamentParticipants(tournamentId);
      
      // Vérification qu'il y a au moins 2 participants
      if (participants.length < 2) {
        return resolve(false);
      }

      // Mise à jour du statut du tournoi
      const updateQuery = `
        UPDATE tournaments
        SET status = 'in_progress', started_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      db.run(updateQuery, [tournamentId], async function (err) {
        if (err) {
          return reject(err);
        }

        if (this.changes === 0) {
          return resolve(false);
        }

        try {
          // Génération des matchs du tournoi
          await generateTournamentMatches(tournamentId, participants);
          resolve(true);
        } catch (err) {
          reject(err);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Génère les matchs d'un tournoi
 * @param tournamentId - ID du tournoi
 * @param participants - Liste des participants
 * @returns Promise avec succès ou échec
 */
async function generateTournamentMatches(tournamentId: number, participants: TournamentParticipant[]): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      // Mélange aléatoire des participants
      const shuffledParticipants = [...participants].sort(() => Math.random() - 0.5);
      
      // Calcul du nombre de tours nécessaires
      const numPlayers = shuffledParticipants.length;
      const numRounds = Math.ceil(Math.log2(numPlayers));
      
      // Calcul du nombre de matchs au premier tour
      const numFirstRoundMatches = Math.pow(2, numRounds - 1);
      const numByes = numFirstRoundMatches * 2 - numPlayers;
      
      // Création des matchs du premier tour
      const matches: { player1_id: number | null, player2_id: number | null, round: number, position: number }[] = [];
      
      let playerIndex = 0;
      for (let i = 0; i < numFirstRoundMatches; i++) {
        // Si nous avons des "byes" (exemptions), certains joueurs passent directement au tour suivant
        if (i < numByes) {
          // Match avec un seul joueur (l'autre est "bye")
          matches.push({
            player1_id: playerIndex < numPlayers ? shuffledParticipants[playerIndex++].user_id : null,
            player2_id: null,
            round: 1,
            position: i + 1
          });
        } else {
          // Match normal avec deux joueurs
          matches.push({
            player1_id: playerIndex < numPlayers ? shuffledParticipants[playerIndex++].user_id : null,
            player2_id: playerIndex < numPlayers ? shuffledParticipants[playerIndex++].user_id : null,
            round: 1,
            position: i + 1
          });
        }
      }
      
      // Création des matchs des tours suivants (vides pour l'instant)
      let matchPosition = 1;
      for (let round = 2; round <= numRounds; round++) {
        const numMatchesInRound = Math.pow(2, numRounds - round);
        for (let i = 0; i < numMatchesInRound; i++) {
          matches.push({
            player1_id: null,
            player2_id: null,
            round,
            position: matchPosition++
          });
        }
      }
      
      // Insertion des matchs dans la base de données
      const insertPromises = matches.map(match => {
        return new Promise<void>((resolve, reject) => {
          const query = `
            INSERT INTO tournament_matches (tournament_id, round, position, player1_id, player2_id, status)
            VALUES (?, ?, ?, ?, ?, ?)
          `;
          
          // Si un joueur est seul dans son match (bye), il passe automatiquement au tour suivant
          const status = match.player2_id === null && match.player1_id !== null ? 'completed' : 'pending';
          
          db.run(
            query,
            [tournamentId, match.round, match.position, match.player1_id, match.player2_id, status],
            function (err) {
              if (err) {
                return reject(err);
              }
              
              resolve();
            }
          );
        });
      });
      
      await Promise.all(insertPromises);
      
      // Mise à jour des matchs du deuxième tour pour les joueurs qui ont un "bye"
      await updateNextRoundMatches(tournamentId);
      
      resolve(true);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Met à jour les matchs du tour suivant
 * @param tournamentId - ID du tournoi
 * @returns Promise avec succès ou échec
 */
async function updateNextRoundMatches(tournamentId: number): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      // Récupération des matchs terminés
      const query = `
        SELECT *
        FROM tournament_matches
        WHERE tournament_id = ? AND status = 'completed'
      `;
      
      db.all(query, [tournamentId], async (err, completedMatches: TournamentMatch[]) => {
        if (err) {
          return reject(err);
        }
        
        // Pour chaque match terminé, mettre à jour le match du tour suivant
        const updatePromises = completedMatches.map(match => {
          return new Promise<void>(async (resolve, reject) => {
            try {
              // Détermination du gagnant
              const winnerId = match.player2_id === null ? match.player1_id : null;
              
              if (winnerId === null) {
                return resolve();  // Pas de gagnant déterminé
              }
              
              // Calcul de la position dans le tour suivant
              const nextRound = match.round + 1;
              const nextPosition = Math.ceil(match.position / 2);
              
              // Détermination si le joueur sera player1 ou player2 dans le match suivant
              const isPlayer1 = match.position % 2 !== 0;
              
              // Mise à jour du match du tour suivant
              const updateQuery = `
                UPDATE tournament_matches
                SET ${isPlayer1 ? 'player1_id' : 'player2_id'} = ?
                WHERE tournament_id = ? AND round = ? AND position = ?
              `;
              
              db.run(
                updateQuery,
                [winnerId, tournamentId, nextRound, nextPosition],
                function (err) {
                  if (err) {
                    return reject(err);
                  }
                  
                  resolve();
                }
              );
            } catch (err) {
              reject(err);
            }
          });
        });
        
        await Promise.all(updatePromises);
        resolve(true);
      });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Récupère les matchs d'un tournoi
 * @param tournamentId - ID du tournoi
 * @returns Promise avec la liste des matchs
 */
export async function getTournamentMatches(tournamentId: number): Promise<TournamentMatch[]> {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT tm.*, 
             u1.username as player1_username, 
             u2.username as player2_username
      FROM tournament_matches tm
      LEFT JOIN users u1 ON tm.player1_id = u1.id
      LEFT JOIN users u2 ON tm.player2_id = u2.id
      WHERE tm.tournament_id = ?
      ORDER BY tm.round, tm.position
    `;
    
    db.all(query, [tournamentId], (err, rows) => {
      if (err) {
        return reject(err);
      }
      
      resolve(rows as TournamentMatch[]);
    });
  });
}

/**
 * Démarre un match de tournoi
 * @param matchId - ID du match
 * @returns Promise avec l'ID de la partie créée ou null en cas d'échec
 */
export async function startTournamentMatch(matchId: number): Promise<number | null> {
  return new Promise(async (resolve, reject) => {
    try {
      // Récupération du match
      const query = `
        SELECT *
        FROM tournament_matches
        WHERE id = ?
      `;
      
      db.get(query, [matchId], async (err, match: TournamentMatch) => {
        if (err) {
          return reject(err);
        }
        
        if (!match || match.status !== 'pending' || !match.player1_id || !match.player2_id) {
          return resolve(null);
        }
        
        try {
          // Création d'une partie pour ce match
          const gameId = await createGame({
            player1_id: match.player1_id,
            player2_id: match.player2_id,
            tournament_id: match.tournament_id
          });
          
          // Mise à jour du match avec l'ID de la partie et le statut
          const updateQuery = `
            UPDATE tournament_matches
            SET game_id = ?, status = 'in_progress'
            WHERE id = ?
          `;
          
          db.run(updateQuery, [gameId, matchId], function (err) {
            if (err) {
              return reject(err);
            }
            
            resolve(gameId);
          });
        } catch (err) {
          reject(err);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Termine un match de tournoi
 * @param matchId - ID du match
 * @param winnerId - ID du joueur gagnant
 * @returns Promise avec succès ou échec
 */
export async function endTournamentMatch(matchId: number, winnerId: number): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      // Récupération du match
      const query = `
        SELECT *
        FROM tournament_matches
        WHERE id = ?
      `;
      
      db.get(query, [matchId], async (err, match: TournamentMatch) => {
        if (err) {
          return reject(err);
        }
        
        if (!match || match.status !== 'in_progress') {
          return resolve(false);
        }
        
        // Vérification que le gagnant est bien un des joueurs
        if (winnerId !== match.player1_id && winnerId !== match.player2_id) {
          return resolve(false);
        }
        
        // Mise à jour du match avec le statut terminé
        const updateQuery = `
          UPDATE tournament_matches
          SET status = 'completed'
          WHERE id = ?
        `;
        
        db.run(updateQuery, [matchId], async function (err) {
          if (err) {
            return reject(err);
          }
          
          if (this.changes === 0) {
            return resolve(false);
          }
          
          try {
            // Mise à jour du match du tour suivant
            await updateNextRoundWithWinner(match.tournament_id, match.round, match.position, winnerId);
            
            // Vérification si le tournoi est terminé
            await checkTournamentCompletion(match.tournament_id);
            
            resolve(true);
          } catch (err) {
            reject(err);
          }
        });
      });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Met à jour le match du tour suivant avec le gagnant
 * @param tournamentId - ID du tournoi
 * @param round - Tour actuel
 * @param position - Position dans le tour actuel
 * @param winnerId - ID du joueur gagnant
 * @returns Promise avec succès ou échec
 */
async function updateNextRoundWithWinner(
  tournamentId: number,
  round: number,
  position: number,
  winnerId: number
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    // Calcul de la position dans le tour suivant
    const nextRound = round + 1;
    const nextPosition = Math.ceil(position / 2);
    
    // Détermination si le joueur sera player1 ou player2 dans le match suivant
    const isPlayer1 = position % 2 !== 0;
    
    // Mise à jour du match du tour suivant
    const updateQuery = `
      UPDATE tournament_matches
      SET ${isPlayer1 ? 'player1_id' : 'player2_id'} = ?
      WHERE tournament_id = ? AND round = ? AND position = ?
    `;
    
    db.run(
      updateQuery,
      [winnerId, tournamentId, nextRound, nextPosition],
      function (err) {
        if (err) {
          return reject(err);
        }
        
        resolve(this.changes > 0);
      }
    );
  });
}

/**
 * Vérifie si un tournoi est terminé
 * @param tournamentId - ID du tournoi
 * @returns Promise avec succès ou échec
 */
async function checkTournamentCompletion(tournamentId: number): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      // Récupération du dernier match (finale)
      const query = `
        SELECT *
        FROM tournament_matches
        WHERE tournament_id = ?
        ORDER BY round DESC, position ASC
        LIMIT 1
      `;
      
      db.get(query, [tournamentId], (err, finalMatch: TournamentMatch) => {
        if (err) {
          return reject(err);
        }
        
        if (!finalMatch || finalMatch.status !== 'completed') {
          return resolve(false);
        }
        
        // Le tournoi est terminé, mise à jour du statut
        const updateQuery = `
          UPDATE tournaments
          SET status = 'completed', ended_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `;
        
        db.run(updateQuery, [tournamentId], function (err) {
          if (err) {
            return reject(err);
          }
          
          // Mise à jour des statistiques des joueurs
          updatePlayerTournamentStats(tournamentId, finalMatch.player1_id || 0)
            .then(() => resolve(this.changes > 0))
            .catch(reject);
        });
      });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Met à jour les statistiques de tournoi d'un joueur
 * @param tournamentId - ID du tournoi
 * @param winnerId - ID du joueur gagnant
 * @returns Promise avec succès ou échec
 */
async function updatePlayerTournamentStats(tournamentId: number, winnerId: number): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      // Récupération des participants
      const participants = await getTournamentParticipants(tournamentId);
      
      // Mise à jour des statistiques pour chaque participant
      const updatePromises = participants.map(participant => {
        return new Promise<void>((resolve, reject) => {
          const query = `
            UPDATE player_stats
            SET 
              tournaments_played = tournaments_played + 1,
              tournaments_won = tournaments_won + CASE WHEN ? = ? THEN 1 ELSE 0 END,
              updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ?
          `;
          
          db.run(query, [participant.user_id, winnerId, participant.user_id], (err) => {
            if (err) {
              return reject(err);
            }
            
            resolve();
          });
        });
      });
      
      await Promise.all(updatePromises);
      resolve(true);
    } catch (err) {
      reject(err);
    }
  });
}
