/**
 * Service API pour la communication avec le backend
 *
 * Ce service gère toutes les requêtes HTTP vers l'API backend
 * et fournit des méthodes pour récupérer et manipuler les données.
 */
// URL de base de l'API (à ajuster selon votre configuration)
const API_URL = 'http://localhost:3000';
// Fonction pour récupérer le token d'authentification du localStorage
function getAuthToken() {
    return localStorage.getItem('authToken');
}
// Fonction pour récupérer l'utilisateur connecté du localStorage
export function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr)
        return null;
    try {
        return JSON.parse(userStr);
    }
    catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        return null;
    }
}
/**
 * Fonction générique pour effectuer des requêtes HTTP
 */
async function fetchApi(endpoint, options = {}) {
    const token = getAuthToken();
    // Ajouter les headers par défaut
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers
    };
    try {
        console.log(`Envoi de requête à ${API_URL}/api${endpoint}`);
        const response = await fetch(`${API_URL}/api${endpoint}`, {
            ...options,
            headers
        });
        // Vérifier si la requête a réussi
        if (!response.ok) {
            // Essayer de récupérer le message d'erreur du serveur
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Erreur ${response.status}: ${response.statusText}`);
        }
        // Vérifier si la réponse est vide
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }
        return {};
    }
    catch (error) {
        console.error(`Erreur API (${endpoint}):`, error);
        throw error;
    }
}
/**
 * Service pour les opérations liées aux utilisateurs
 */
export const userApi = {
    // Inscription d'un nouvel utilisateur
    register: (userData) => fetchApi('/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    }),
    // Connexion d'un utilisateur
    login: (credentials) => fetchApi('/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),
    // Récupérer le profil d'un utilisateur
    getProfile: (userId) => fetchApi(`/users/${userId}`),
    // Mettre à jour le profil d'un utilisateur
    updateProfile: (userId, data) => fetchApi(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    // Récupérer les statistiques d'un joueur
    getPlayerStats: (userId) => fetchApi(`/users/${userId}/stats`),
    // Récupérer la liste des amis d'un utilisateur
    getFriends: (userId) => fetchApi(`/users/${userId}/friends`),
    // Ajouter un ami
    addFriend: (userId, friendId) => fetchApi(`/users/${userId}/friends`, {
        method: 'POST',
        body: JSON.stringify({ friendId })
    }),
    // Accepter une demande d'ami
    acceptFriendRequest: (userId, friendId) => fetchApi(`/users/${userId}/friends/accept`, {
        method: 'PUT',
        body: JSON.stringify({ friendId })
    }),
    // Rejeter une demande d'ami
    rejectFriendRequest: (userId, friendId) => fetchApi(`/users/${userId}/friends/reject`, {
        method: 'PUT',
        body: JSON.stringify({ friendId })
    }),
    // Supprimer un ami
    removeFriend: (userId, friendId) => fetchApi(`/users/${userId}/friends/${friendId}`, {
        method: 'DELETE'
    })
};
/**
 * Service pour les opérations liées aux jeux
 */
export const gameApi = {
    // Récupérer l'historique des parties d'un joueur
    getGameHistory: (userId) => fetchApi(`/users/${userId}/games`),
    // Récupérer les détails d'une partie
    getGameDetails: (gameId) => fetchApi(`/games/${gameId}`)
};
/**
 * Service pour les opérations liées aux tournois
 */
export const tournamentApi = {
    // Récupérer la liste des tournois
    getTournaments: () => fetchApi('/tournaments'),
    // Récupérer les détails d'un tournoi
    getTournamentDetails: (tournamentId) => fetchApi(`/tournaments/${tournamentId}`),
    // S'inscrire à un tournoi
    registerToTournament: (tournamentId) => fetchApi(`/tournaments/${tournamentId}/register`, {
        method: 'POST'
    })
};
//# sourceMappingURL=api.js.map