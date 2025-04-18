"use strict";
/**
 * Service de gestion des parties de Pong
 *
 * Ce service gère les opérations liées aux parties de Pong :
 * - Création d'une partie
 * - Mise à jour du score
 * - Récupération des parties d'un utilisateur
 * - Gestion des statistiques de jeu
 *
 * Il interagit avec la base de données SQLite pour stocker et récupérer les informations.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllGames = void 0;
exports.createGame = createGame;
exports.getGameById = getGameById;
exports.getUserGames = getUserGames;
exports.updateGameScore = updateGameScore;
exports.endGame = endGame;
exports.getPlayerStats = getPlayerStats;
const database_1 = require("../models/database");
/**
 * Crée une nouvelle partie
 * @param gameData - Données de la partie à créer
 * @returns Promise avec l'ID de la partie créée
 */
async function createGame(gameData) {
    return new Promise((resolve, reject) => {
        const query = `
      INSERT INTO games (player1_id, player2_id, tournament_id)
      VALUES (?, ?, ?)
    `;
        database_1.db.run(query, [gameData.player1_id, gameData.player2_id, gameData.tournament_id || null], function (err) {
            if (err) {
                return reject(err);
            }
            resolve(this.lastID);
        });
    });
}
/**
 * Récupère une partie par son ID
 * @param gameId - ID de la partie
 * @returns Promise avec la partie ou null si non trouvée
 */
async function getGameById(gameId) {
    return new Promise((resolve, reject) => {
        const query = `
      SELECT *
      FROM games
      WHERE id = ?
    `;
        database_1.db.get(query, [gameId], (err, row) => {
            if (err) {
                return reject(err);
            }
            resolve(row || null);
        });
    });
}
/**
 * Récupère les parties d'un utilisateur
 * @param userId - ID de l'utilisateur
 * @param limit - Nombre maximum de parties à récupérer
 * @param offset - Décalage pour la pagination
 * @returns Promise avec la liste des parties
 */
async function getUserGames(userId, limit = 10, offset = 0) {
    return new Promise((resolve, reject) => {
        const query = `
      SELECT *
      FROM games
      WHERE player1_id = ? OR player2_id = ?
      ORDER BY started_at DESC
      LIMIT ? OFFSET ?
    `;
        database_1.db.all(query, [userId, userId, limit, offset], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}
/**
 * Met à jour le score d'une partie
 * @param gameId - ID de la partie
 * @param scoreData - Données du score à mettre à jour
 * @returns Promise avec succès ou échec
 */
async function updateGameScore(gameId, scoreData) {
    return new Promise((resolve, reject) => {
        // Préparation des champs à mettre à jour
        const updates = [];
        const values = [];
        if (scoreData.player1_score !== undefined) {
            updates.push('player1_score = ?');
            values.push(scoreData.player1_score);
        }
        if (scoreData.player2_score !== undefined) {
            updates.push('player2_score = ?');
            values.push(scoreData.player2_score);
        }
        if (scoreData.winner_id !== undefined) {
            updates.push('winner_id = ?');
            values.push(scoreData.winner_id);
            // Si un gagnant est défini, on marque la partie comme terminée
            updates.push('ended_at = CURRENT_TIMESTAMP');
        }
        // Si aucun champ à mettre à jour, on retourne true
        if (updates.length === 0) {
            return resolve(true);
        }
        // Ajout de l'ID de la partie aux valeurs
        values.push(gameId);
        const query = `
      UPDATE games
      SET ${updates.join(', ')}
      WHERE id = ?
    `;
        database_1.db.run(query, values, function (err) {
            if (err) {
                return reject(err);
            }
            // Si un gagnant est défini, on met à jour les statistiques des joueurs
            if (scoreData.winner_id !== undefined) {
                updatePlayerStats(gameId)
                    .then(() => resolve(this.changes > 0))
                    .catch(reject);
            }
            else {
                resolve(this.changes > 0);
            }
        });
    });
}
/**
 * Termine une partie
 * @param gameId - ID de la partie
 * @param winnerId - ID du joueur gagnant
 * @returns Promise avec succès ou échec
 */
async function endGame(gameId, winnerId) {
    return new Promise(async (resolve, reject) => {
        try {
            // Récupération de la partie
            const game = await getGameById(gameId);
            if (!game) {
                return resolve(false);
            }
            // Vérification que le gagnant est bien un des joueurs
            if (winnerId !== game.player1_id && winnerId !== game.player2_id) {
                return resolve(false);
            }
            // Mise à jour de la partie
            const query = `
        UPDATE games
        SET winner_id = ?, ended_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
            database_1.db.run(query, [winnerId, gameId], function (err) {
                if (err) {
                    return reject(err);
                }
                // Mise à jour des statistiques des joueurs
                updatePlayerStats(gameId)
                    .then(() => resolve(this.changes > 0))
                    .catch(reject);
            });
        }
        catch (err) {
            reject(err);
        }
    });
}
/**
 * Met à jour les statistiques des joueurs après une partie
 * @param gameId - ID de la partie
 * @returns Promise avec succès ou échec
 */
async function updatePlayerStats(gameId) {
    return new Promise(async (resolve, reject) => {
        try {
            // Récupération de la partie
            const game = await getGameById(gameId);
            if (!game || !game.winner_id) {
                return resolve(false);
            }
            // Détermination du gagnant et du perdant
            const winnerId = game.winner_id;
            const loserId = winnerId === game.player1_id ? game.player2_id : game.player1_id;
            // Mise à jour des statistiques du gagnant
            const updateWinnerQuery = `
        UPDATE player_stats
        SET 
          games_played = games_played + 1,
          games_won = games_won + 1,
          total_points_scored = total_points_scored + ?,
          total_points_conceded = total_points_conceded + ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `;
            const winnerPointsScored = winnerId === game.player1_id ? game.player1_score : game.player2_score;
            const winnerPointsConceded = winnerId === game.player1_id ? game.player2_score : game.player1_score;
            database_1.db.run(updateWinnerQuery, [winnerPointsScored, winnerPointsConceded, winnerId], (err) => {
                if (err) {
                    return reject(err);
                }
                // Mise à jour des statistiques du perdant
                const updateLoserQuery = `
          UPDATE player_stats
          SET 
            games_played = games_played + 1,
            games_lost = games_lost + 1,
            total_points_scored = total_points_scored + ?,
            total_points_conceded = total_points_conceded + ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ?
        `;
                const loserPointsScored = loserId === game.player1_id ? game.player1_score : game.player2_score;
                const loserPointsConceded = loserId === game.player1_id ? game.player2_score : game.player1_score;
                database_1.db.run(updateLoserQuery, [loserPointsScored, loserPointsConceded, loserId], (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(true);
                });
            });
        }
        catch (err) {
            reject(err);
        }
    });
}
/**
 * Récupère les statistiques d'un joueur
 * @param userId - ID du joueur
 * @returns Promise avec les statistiques du joueur
 */
async function getPlayerStats(userId) {
    return new Promise((resolve, reject) => {
        const query = `
      SELECT *
      FROM player_stats
      WHERE user_id = ?
    `;
        database_1.db.get(query, [userId], (err, row) => {
            if (err) {
                return reject(err);
            }
            if (!row) {
                // Si aucune statistique n'existe, on crée une entrée vide
                database_1.db.run('INSERT INTO player_stats (user_id) VALUES (?)', [userId], (err) => {
                    if (err) {
                        return reject(err);
                    }
                    // Récupération des statistiques nouvellement créées
                    database_1.db.get(query, [userId], (err, row) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(row);
                    });
                });
            }
            else {
                resolve(row);
            }
        });
    });
}
/**
 * Récupère toutes les parties de jeu
 *
 * @returns {Promise<Array>} Liste des parties
 */
const getAllGames = async () => {
    return new Promise((resolve, reject) => {
        database_1.db.all(`SELECT g.*, 
        u1.username as player1_username, 
        u2.username as player2_username 
      FROM games g
      JOIN users u1 ON g.player1_id = u1.id
      JOIN users u2 ON g.player2_id = u2.id
      ORDER BY g.created_at DESC`, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};
exports.getAllGames = getAllGames;
