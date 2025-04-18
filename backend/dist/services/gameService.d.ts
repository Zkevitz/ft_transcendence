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
export interface Game {
    id: number;
    player1_id: number;
    player2_id: number;
    player1_score: number;
    player2_score: number;
    winner_id: number | null;
    tournament_id: number | null;
    started_at: string;
    ended_at: string | null;
}
export interface CreateGameData {
    player1_id: number;
    player2_id: number;
    tournament_id?: number;
}
export interface UpdateScoreData {
    player1_score?: number;
    player2_score?: number;
    winner_id?: number;
}
/**
 * Crée une nouvelle partie
 * @param gameData - Données de la partie à créer
 * @returns Promise avec l'ID de la partie créée
 */
export declare function createGame(gameData: CreateGameData): Promise<number>;
/**
 * Récupère une partie par son ID
 * @param gameId - ID de la partie
 * @returns Promise avec la partie ou null si non trouvée
 */
export declare function getGameById(gameId: number): Promise<Game | null>;
/**
 * Récupère les parties d'un utilisateur
 * @param userId - ID de l'utilisateur
 * @param limit - Nombre maximum de parties à récupérer
 * @param offset - Décalage pour la pagination
 * @returns Promise avec la liste des parties
 */
export declare function getUserGames(userId: number, limit?: number, offset?: number): Promise<Game[]>;
/**
 * Met à jour le score d'une partie
 * @param gameId - ID de la partie
 * @param scoreData - Données du score à mettre à jour
 * @returns Promise avec succès ou échec
 */
export declare function updateGameScore(gameId: number, scoreData: UpdateScoreData): Promise<boolean>;
/**
 * Termine une partie
 * @param gameId - ID de la partie
 * @param winnerId - ID du joueur gagnant
 * @returns Promise avec succès ou échec
 */
export declare function endGame(gameId: number, winnerId: number): Promise<boolean>;
/**
 * Récupère les statistiques d'un joueur
 * @param userId - ID du joueur
 * @returns Promise avec les statistiques du joueur
 */
export declare function getPlayerStats(userId: number): Promise<any>;
/**
 * Récupère toutes les parties de jeu
 *
 * @returns {Promise<Array>} Liste des parties
 */
export declare const getAllGames: () => Promise<any[]>;
