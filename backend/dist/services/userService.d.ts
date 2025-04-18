/**
 * Service de gestion des utilisateurs
 *
 * Ce service gère les opérations liées aux utilisateurs :
 * - Création d'un compte
 * - Authentification
 * - Récupération des informations utilisateur
 * - Mise à jour du profil
 * - Gestion des amis
 *
 * Il utilise bcrypt pour le hachage des mots de passe afin de garantir la sécurité.
 */
export interface User {
    id: number;
    username: string;
    email: string;
    avatar_url?: string;
    created_at: string;
    updated_at: string;
}
export interface CreateUserData {
    username: string;
    email: string;
    password: string;
    avatar_url?: string;
}
export interface UpdateUserData {
    username?: string;
    email?: string;
    password?: string;
    avatar_url?: string;
}
/**
 * Crée un nouvel utilisateur
 * @param userData - Données de l'utilisateur à créer
 * @returns Promise avec l'ID de l'utilisateur créé
 */
export declare function createUser(userData: CreateUserData): Promise<number>;
/**
 * Authentifie un utilisateur
 * @param email - Email de l'utilisateur
 * @param password - Mot de passe de l'utilisateur
 * @returns Promise avec l'utilisateur authentifié ou null si échec
 */
export declare function authenticateUser(email: string, password: string): Promise<User | null>;
/**
 * Récupère un utilisateur par son ID
 * @param userId - ID de l'utilisateur
 * @returns Promise avec l'utilisateur ou null si non trouvé
 */
export declare function getUserById(userId: number): Promise<User | null>;
/**
 * Récupère un utilisateur par son nom d'utilisateur
 * @param username - Nom d'utilisateur
 * @returns Promise avec l'utilisateur ou null si non trouvé
 */
export declare function getUserByUsername(username: string): Promise<User | null>;
/**
 * Met à jour les informations d'un utilisateur
 * @param userId - ID de l'utilisateur
 * @param updateData - Données à mettre à jour
 * @returns Promise avec succès ou échec
 */
export declare function updateUser(userId: number, updateData: UpdateUserData): Promise<boolean>;
/**
 * Supprime un utilisateur
 * @param userId - ID de l'utilisateur
 * @returns Promise avec succès ou échec
 */
export declare function deleteUser(userId: number): Promise<boolean>;
/**
 * Récupère la liste des amis d'un utilisateur
 * @param userId - ID de l'utilisateur
 * @returns Promise avec la liste des amis
 */
export declare function getUserFriends(userId: number): Promise<User[]>;
/**
 * Ajoute un ami
 * @param userId - ID de l'utilisateur
 * @param friendId - ID de l'ami à ajouter
 * @returns Promise avec succès ou échec
 */
export declare function addFriend(userId: number, friendId: number): Promise<boolean>;
/**
 * Accepte une demande d'ami
 * @param userId - ID de l'utilisateur
 * @param friendId - ID de l'ami à accepter
 * @returns Promise avec succès ou échec
 */
export declare function acceptFriendRequest(userId: number, friendId: number): Promise<boolean>;
/**
 * Rejette une demande d'ami
 * @param userId - ID de l'utilisateur
 * @param friendId - ID de l'ami à rejeter
 * @returns Promise avec succès ou échec
 */
export declare function rejectFriendRequest(userId: number, friendId: number): Promise<boolean>;
/**
 * Supprime un ami
 * @param userId - ID de l'utilisateur
 * @param friendId - ID de l'ami à supprimer
 * @returns Promise avec succès ou échec
 */
export declare function removeFriend(userId: number, friendId: number): Promise<boolean>;
