"use strict";
/**
 * Configuration de la base de données SQLite
 *
 * Ce fichier configure la connexion à la base de données SQLite et définit les schémas des tables.
 * SQLite est utilisé comme spécifié dans le module Web du sujet.
 *
 * La base de données stocke les informations sur les utilisateurs, les parties, les tournois, etc.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.closeDatabase = closeDatabase;
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Chemin vers le fichier de base de données
const dbPath = path_1.default.resolve(__dirname, '../../data/database.sqlite');
// Assurez-vous que le répertoire data existe
const dbDir = path_1.default.dirname(dbPath);
if (!fs_1.default.existsSync(dbDir)) {
    fs_1.default.mkdirSync(dbDir, { recursive: true });
}
// Création de la connexion à la base de données
exports.db = new sqlite3_1.default.Database(dbPath, (err) => {
    if (err) {
        console.error('Erreur lors de la connexion à la base de données SQLite:', err.message);
    }
    else {
        console.log('Connexion à la base de données SQLite établie');
        // Initialisation des tables
        initDatabase();
    }
});
/**
 * Initialise la base de données en créant les tables nécessaires si elles n'existent pas
 */
function initDatabase() {
    // Activation des clés étrangères
    exports.db.run('PRAGMA foreign_keys = ON');
    // Table des utilisateurs
    exports.db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      avatar_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
    // Table des sessions
    exports.db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);
    // Table des parties
    exports.db.run(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player1_id INTEGER NOT NULL,
      player2_id INTEGER NOT NULL,
      player1_score INTEGER NOT NULL DEFAULT 0,
      player2_score INTEGER NOT NULL DEFAULT 0,
      winner_id INTEGER,
      tournament_id INTEGER,
      started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ended_at TIMESTAMP,
      FOREIGN KEY (player1_id) REFERENCES users (id),
      FOREIGN KEY (player2_id) REFERENCES users (id),
      FOREIGN KEY (winner_id) REFERENCES users (id),
      FOREIGN KEY (tournament_id) REFERENCES tournaments (id) ON DELETE SET NULL
    )
  `);
    // Table des tournois
    exports.db.run(`
    CREATE TABLE IF NOT EXISTS tournaments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      organizer_id INTEGER NOT NULL,
      max_players INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'registration', -- registration, in_progress, completed
      started_at TIMESTAMP,
      ended_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organizer_id) REFERENCES users (id)
    )
  `);
    // Table des participants aux tournois
    exports.db.run(`
    CREATE TABLE IF NOT EXISTS tournament_participants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tournament_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tournament_id) REFERENCES tournaments (id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      UNIQUE(tournament_id, user_id)
    )
  `);
    // Table des matchs de tournoi
    exports.db.run(`
    CREATE TABLE IF NOT EXISTS tournament_matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tournament_id INTEGER NOT NULL,
      game_id INTEGER,
      round INTEGER NOT NULL,
      position INTEGER NOT NULL,
      player1_id INTEGER,
      player2_id INTEGER,
      status TEXT NOT NULL DEFAULT 'pending', -- pending, in_progress, completed
      FOREIGN KEY (tournament_id) REFERENCES tournaments (id) ON DELETE CASCADE,
      FOREIGN KEY (game_id) REFERENCES games (id) ON DELETE SET NULL,
      FOREIGN KEY (player1_id) REFERENCES users (id) ON DELETE SET NULL,
      FOREIGN KEY (player2_id) REFERENCES users (id) ON DELETE SET NULL
    )
  `);
    // Table des statistiques des joueurs
    exports.db.run(`
    CREATE TABLE IF NOT EXISTS player_stats (
      user_id INTEGER PRIMARY KEY,
      games_played INTEGER NOT NULL DEFAULT 0,
      games_won INTEGER NOT NULL DEFAULT 0,
      games_lost INTEGER NOT NULL DEFAULT 0,
      tournaments_played INTEGER NOT NULL DEFAULT 0,
      tournaments_won INTEGER NOT NULL DEFAULT 0,
      total_points_scored INTEGER NOT NULL DEFAULT 0,
      total_points_conceded INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);
    // Table des amis
    exports.db.run(`
    CREATE TABLE IF NOT EXISTS friendships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      friend_id INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, rejected
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (friend_id) REFERENCES users (id) ON DELETE CASCADE,
      UNIQUE(user_id, friend_id)
    )
  `);
    // Table des messages de chat
    exports.db.run(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER NOT NULL,
      receiver_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      read BOOLEAN NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (receiver_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);
    console.log('Tables de la base de données initialisées');
}
/**
 * Ferme la connexion à la base de données
 */
function closeDatabase() {
    exports.db.close((err) => {
        if (err) {
            console.error('Erreur lors de la fermeture de la base de données:', err.message);
        }
        else {
            console.log('Connexion à la base de données fermée');
        }
    });
}
// Gestion de la fermeture propre de la base de données lors de l'arrêt de l'application
process.on('SIGINT', () => {
    closeDatabase();
    process.exit(0);
});
process.on('SIGTERM', () => {
    closeDatabase();
    process.exit(0);
});
