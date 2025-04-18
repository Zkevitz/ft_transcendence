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
export interface CreateTournamentData {
    name: string;
    organizer_id: number;
    max_players: number;
}
export interface TournamentParticipant {
    id: number;
    tournament_id: number;
    user_id: number;
    registered_at: string;
    username?: string;
}
export interface TournamentMatch {
    id: number;
    tournament_id: number;
    game_id: number | null;
    round: number;
    position: number;
    player1_id: number | null;
    player2_id: number | null;
    status: 'pending' | 'in_progress' | 'completed';
    player1_username?: string;
    player2_username?: string;
}
/**
 * Crée un nouveau tournoi
 * @param tournamentData - Données du tournoi à créer
 * @returns Promise avec l'ID du tournoi créé
 */
export declare function createTournament(tournamentData: CreateTournamentData): Promise<number>;
/**
 * Récupère un tournoi par son ID
 * @param tournamentId - ID du tournoi
 * @returns Promise avec le tournoi ou null si non trouvé
 */
export declare function getTournamentById(tournamentId: number): Promise<Tournament | null>;
/**
 * Récupère tous les tournois
 * @param status - Statut des tournois à récupérer (optionnel)
 * @returns Promise avec la liste des tournois
 */
export declare function getAllTournaments(status?: 'registration' | 'in_progress' | 'completed'): Promise<Tournament[]>;
/**
 * Inscrit un joueur à un tournoi
 * @param tournamentId - ID du tournoi
 * @param userId - ID du joueur
 * @returns Promise avec succès ou échec
 */
export declare function registerPlayerToTournament(tournamentId: number, userId: number): Promise<boolean>;
/**
 * Désinscrit un joueur d'un tournoi
 * @param tournamentId - ID du tournoi
 * @param userId - ID du joueur
 * @returns Promise avec succès ou échec
 */
export declare function unregisterPlayerFromTournament(tournamentId: number, userId: number): Promise<boolean>;
/**
 * Récupère les participants d'un tournoi
 * @param tournamentId - ID du tournoi
 * @returns Promise avec la liste des participants
 */
export declare function getTournamentParticipants(tournamentId: number): Promise<TournamentParticipant[]>;
/**
 * Démarre un tournoi
 * @param tournamentId - ID du tournoi
 * @returns Promise avec succès ou échec
 */
export declare function startTournament(tournamentId: number): Promise<boolean>;
/**
 * Récupère les matchs d'un tournoi
 * @param tournamentId - ID du tournoi
 * @returns Promise avec la liste des matchs
 */
export declare function getTournamentMatches(tournamentId: number): Promise<TournamentMatch[]>;
/**
 * Démarre un match de tournoi
 * @param matchId - ID du match
 * @returns Promise avec l'ID de la partie créée ou null en cas d'échec
 */
export declare function startTournamentMatch(matchId: number): Promise<number | null>;
/**
 * Termine un match de tournoi
 * @param matchId - ID du match
 * @param winnerId - ID du joueur gagnant
 * @returns Promise avec succès ou échec
 */
export declare function endTournamentMatch(matchId: number, winnerId: number): Promise<boolean>;
