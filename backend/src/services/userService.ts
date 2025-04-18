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

import { db } from '../models/database';
import bcrypt from 'bcrypt';

// Interface pour les données utilisateur
export interface User {
  id: number;
  username: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// Interface pour la création d'un utilisateur
export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  avatar_url?: string;
}

// Interface pour la mise à jour d'un utilisateur
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
export async function createUser(userData: CreateUserData): Promise<number> {
  return new Promise((resolve, reject) => {
    // Hachage du mot de passe avant de le stocker
    bcrypt.hash(userData.password, 10, (err, passwordHash) => {
      if (err) {
        return reject(err);
      }

      const query = `
        INSERT INTO users (username, email, password_hash, avatar_url)
        VALUES (?, ?, ?, ?)
      `;

      db.run(
        query,
        [userData.username, userData.email, passwordHash, userData.avatar_url || null],
        function (err) {
          if (err) {
            return reject(err);
          }

          // Création des statistiques initiales du joueur
          db.run(
            'INSERT INTO player_stats (user_id) VALUES (?)',
            [this.lastID],
            (err) => {
              if (err) {
                return reject(err);
              }
              resolve(this.lastID);
            }
          );
        }
      );
    });
  });
}

/**
 * Authentifie un utilisateur
 * @param email - Email de l'utilisateur
 * @param password - Mot de passe de l'utilisateur
 * @returns Promise avec l'utilisateur authentifié ou null si échec
 */
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT id, username, email, password_hash, avatar_url, created_at, updated_at
      FROM users
      WHERE email = ?
    `;

    db.get(query, [email], (err, row: any) => {
      if (err) {
        return reject(err);
      }

      if (!row) {
        return resolve(null);
      }

      // Vérification du mot de passe
      bcrypt.compare(password, row.password_hash, (err, match) => {
        if (err) {
          return reject(err);
        }

        if (!match) {
          return resolve(null);
        }

        // Ne pas renvoyer le hash du mot de passe
        const { password_hash, ...user } = row;
        resolve(user as User);
      });
    });
  });
}

/**
 * Récupère un utilisateur par son ID
 * @param userId - ID de l'utilisateur
 * @returns Promise avec l'utilisateur ou null si non trouvé
 */
export async function getUserById(userId: number): Promise<User | null> {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT id, username, email, avatar_url, created_at, updated_at
      FROM users
      WHERE id = ?
    `;

    db.get(query, [userId], (err, row) => {
      if (err) {
        return reject(err);
      }

      resolve(row as User || null);
    });
  });
}

/**
 * Récupère un utilisateur par son nom d'utilisateur
 * @param username - Nom d'utilisateur
 * @returns Promise avec l'utilisateur ou null si non trouvé
 */
export async function getUserByUsername(username: string): Promise<User | null> {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT id, username, email, avatar_url, created_at, updated_at
      FROM users
      WHERE username = ?
    `;

    db.get(query, [username], (err, row) => {
      if (err) {
        return reject(err);
      }

      resolve(row as User || null);
    });
  });
}

/**
 * Met à jour les informations d'un utilisateur
 * @param userId - ID de l'utilisateur
 * @param updateData - Données à mettre à jour
 * @returns Promise avec succès ou échec
 */
export async function updateUser(userId: number, updateData: UpdateUserData): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      // Préparation des champs à mettre à jour
      const updates: string[] = [];
      const values: any[] = [];

      if (updateData.username) {
        updates.push('username = ?');
        values.push(updateData.username);
      }

      if (updateData.email) {
        updates.push('email = ?');
        values.push(updateData.email);
      }

      if (updateData.password) {
        const passwordHash = await bcrypt.hash(updateData.password, 10);
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

      db.run(query, values, function (err) {
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
 * Supprime un utilisateur
 * @param userId - ID de l'utilisateur
 * @returns Promise avec succès ou échec
 */
export async function deleteUser(userId: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM users WHERE id = ?';

    db.run(query, [userId], function (err) {
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
export async function getUserFriends(userId: number): Promise<User[]> {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT u.id, u.username, u.email, u.avatar_url, u.created_at, u.updated_at
      FROM users u
      JOIN friendships f ON (u.id = f.friend_id AND f.user_id = ? AND f.status = 'accepted')
                         OR (u.id = f.user_id AND f.friend_id = ? AND f.status = 'accepted')
      WHERE u.id != ?
    `;

    db.all(query, [userId, userId, userId], (err, rows) => {
      if (err) {
        return reject(err);
      }

      resolve(rows as User[]);
    });
  });
}

/**
 * Ajoute un ami
 * @param userId - ID de l'utilisateur
 * @param friendId - ID de l'ami à ajouter
 * @returns Promise avec succès ou échec
 */
export async function addFriend(userId: number, friendId: number): Promise<boolean> {
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

    db.run(query, [userId, friendId], function (err) {
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
export async function acceptFriendRequest(userId: number, friendId: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE friendships
      SET status = 'accepted', updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND friend_id = ? AND status = 'pending'
    `;

    db.run(query, [friendId, userId], function (err) {
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
export async function rejectFriendRequest(userId: number, friendId: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE friendships
      SET status = 'rejected', updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND friend_id = ? AND status = 'pending'
    `;

    db.run(query, [friendId, userId], function (err) {
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
export async function removeFriend(userId: number, friendId: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const query = `
      DELETE FROM friendships
      WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)
    `;

    db.run(query, [userId, friendId, friendId, userId], function (err) {
      if (err) {
        return reject(err);
      }

      resolve(this.changes > 0);
    });
  });
}
