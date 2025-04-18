"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.authenticateUser = authenticateUser;
exports.getUserById = getUserById;
exports.getUserByUsername = getUserByUsername;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.getUserFriends = getUserFriends;
exports.addFriend = addFriend;
exports.acceptFriendRequest = acceptFriendRequest;
exports.rejectFriendRequest = rejectFriendRequest;
exports.removeFriend = removeFriend;
const database_1 = require("../models/database");
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * Crée un nouvel utilisateur
 * @param userData - Données de l'utilisateur à créer
 * @returns Promise avec l'ID de l'utilisateur créé
 */
async function createUser(userData) {
    return new Promise((resolve, reject) => {
        // Hachage du mot de passe avant de le stocker
        bcrypt_1.default.hash(userData.password, 10, (err, passwordHash) => {
            if (err) {
                return reject(err);
            }
            const query = `
        INSERT INTO users (username, email, password_hash, avatar_url)
        VALUES (?, ?, ?, ?)
      `;
            database_1.db.run(query, [userData.username, userData.email, passwordHash, userData.avatar_url || null], function (err) {
                if (err) {
                    return reject(err);
                }
                // Création des statistiques initiales du joueur
                database_1.db.run('INSERT INTO player_stats (user_id) VALUES (?)', [this.lastID], (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(this.lastID);
                });
            });
        });
    });
}
/**
 * Authentifie un utilisateur
 * @param email - Email de l'utilisateur
 * @param password - Mot de passe de l'utilisateur
 * @returns Promise avec l'utilisateur authentifié ou null si échec
 */
async function authenticateUser(email, password) {
    return new Promise((resolve, reject) => {
        const query = `
      SELECT id, username, email, password_hash, avatar_url, created_at, updated_at
      FROM users
      WHERE email = ?
    `;
        database_1.db.get(query, [email], (err, row) => {
            if (err) {
                return reject(err);
            }
            if (!row) {
                return resolve(null);
            }
            // Vérification du mot de passe
            bcrypt_1.default.compare(password, row.password_hash, (err, match) => {
                if (err) {
                    return reject(err);
                }
                if (!match) {
                    return resolve(null);
                }
                // Ne pas renvoyer le hash du mot de passe
                const { password_hash, ...user } = row;
                resolve(user);
            });
        });
    });
}
/**
 * Récupère un utilisateur par son ID
 * @param userId - ID de l'utilisateur
 * @returns Promise avec l'utilisateur ou null si non trouvé
 */
async function getUserById(userId) {
    return new Promise((resolve, reject) => {
        const query = `
      SELECT id, username, email, avatar_url, created_at, updated_at
      FROM users
      WHERE id = ?
    `;
        database_1.db.get(query, [userId], (err, row) => {
            if (err) {
                return reject(err);
            }
            resolve(row || null);
        });
    });
}
/**
 * Récupère un utilisateur par son nom d'utilisateur
 * @param username - Nom d'utilisateur
 * @returns Promise avec l'utilisateur ou null si non trouvé
 */
async function getUserByUsername(username) {
    return new Promise((resolve, reject) => {
        const query = `
      SELECT id, username, email, avatar_url, created_at, updated_at
      FROM users
      WHERE username = ?
    `;
        database_1.db.get(query, [username], (err, row) => {
            if (err) {
                return reject(err);
            }
            resolve(row || null);
        });
    });
}
/**
 * Met à jour les informations d'un utilisateur
 * @param userId - ID de l'utilisateur
 * @param updateData - Données à mettre à jour
 * @returns Promise avec succès ou échec
 */
async function updateUser(userId, updateData) {
    return new Promise(async (resolve, reject) => {
        try {
            // Préparation des champs à mettre à jour
            const updates = [];
            const values = [];
            if (updateData.username) {
                updates.push('username = ?');
                values.push(updateData.username);
            }
            if (updateData.email) {
                updates.push('email = ?');
                values.push(updateData.email);
            }
            if (updateData.password) {
                const passwordHash = await bcrypt_1.default.hash(updateData.password, 10);
                updates.push('password_hash = ?');
                values.push(passwordHash);
            }
            if (updateData.avatar_url !== undefined) {
                updates.push('avatar_url = ?');
                values.push(updateData.avatar_url);
            }
            // Ajout de la mise à jour de la date
            updates.push('updated_at = CURRENT_TIMESTAMP');
            // Si aucun champ à mettre à jour, on retourne true
            if (updates.length === 1) {
                return resolve(true);
            }
            // Ajout de l'ID utilisateur aux valeurs
            values.push(userId);
            const query = `
        UPDATE users
        SET ${updates.join(', ')}
        WHERE id = ?
      `;
            database_1.db.run(query, values, function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(this.changes > 0);
            });
        }
        catch (err) {
            reject(err);
        }
    });
}
/**
 * Supprime un utilisateur
 * @param userId - ID de l'utilisateur
 * @returns Promise avec succès ou échec
 */
async function deleteUser(userId) {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM users WHERE id = ?';
        database_1.db.run(query, [userId], function (err) {
            if (err) {
                return reject(err);
            }
            resolve(this.changes > 0);
        });
    });
}
/**
 * Récupère la liste des amis d'un utilisateur
 * @param userId - ID de l'utilisateur
 * @returns Promise avec la liste des amis
 */
async function getUserFriends(userId) {
    return new Promise((resolve, reject) => {
        const query = `
      SELECT u.id, u.username, u.email, u.avatar_url, u.created_at, u.updated_at
      FROM users u
      JOIN friendships f ON (u.id = f.friend_id AND f.user_id = ? AND f.status = 'accepted')
                         OR (u.id = f.user_id AND f.friend_id = ? AND f.status = 'accepted')
      WHERE u.id != ?
    `;
        database_1.db.all(query, [userId, userId, userId], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}
/**
 * Ajoute un ami
 * @param userId - ID de l'utilisateur
 * @param friendId - ID de l'ami à ajouter
 * @returns Promise avec succès ou échec
 */
async function addFriend(userId, friendId) {
    return new Promise((resolve, reject) => {
        // Vérification que l'utilisateur n'essaie pas de s'ajouter lui-même
        if (userId === friendId) {
            return resolve(false);
        }
        const query = `
      INSERT INTO friendships (user_id, friend_id, status)
      VALUES (?, ?, 'pending')
      ON CONFLICT(user_id, friend_id) DO UPDATE SET
      status = 'pending',
      updated_at = CURRENT_TIMESTAMP
    `;
        database_1.db.run(query, [userId, friendId], function (err) {
            if (err) {
                return reject(err);
            }
            resolve(this.changes > 0);
        });
    });
}
/**
 * Accepte une demande d'ami
 * @param userId - ID de l'utilisateur
 * @param friendId - ID de l'ami à accepter
 * @returns Promise avec succès ou échec
 */
async function acceptFriendRequest(userId, friendId) {
    return new Promise((resolve, reject) => {
        const query = `
      UPDATE friendships
      SET status = 'accepted', updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND friend_id = ? AND status = 'pending'
    `;
        database_1.db.run(query, [friendId, userId], function (err) {
            if (err) {
                return reject(err);
            }
            resolve(this.changes > 0);
        });
    });
}
/**
 * Rejette une demande d'ami
 * @param userId - ID de l'utilisateur
 * @param friendId - ID de l'ami à rejeter
 * @returns Promise avec succès ou échec
 */
async function rejectFriendRequest(userId, friendId) {
    return new Promise((resolve, reject) => {
        const query = `
      UPDATE friendships
      SET status = 'rejected', updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND friend_id = ? AND status = 'pending'
    `;
        database_1.db.run(query, [friendId, userId], function (err) {
            if (err) {
                return reject(err);
            }
            resolve(this.changes > 0);
        });
    });
}
/**
 * Supprime un ami
 * @param userId - ID de l'utilisateur
 * @param friendId - ID de l'ami à supprimer
 * @returns Promise avec succès ou échec
 */
async function removeFriend(userId, friendId) {
    return new Promise((resolve, reject) => {
        const query = `
      DELETE FROM friendships
      WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)
    `;
        database_1.db.run(query, [userId, friendId, friendId, userId], function (err) {
            if (err) {
                return reject(err);
            }
            resolve(this.changes > 0);
        });
    });
}
