/**
 * Configuration de la base de données SQLite
 *
 * Ce fichier configure la connexion à la base de données SQLite et définit les schémas des tables.
 * SQLite est utilisé comme spécifié dans le module Web du sujet.
 *
 * La base de données stocke les informations sur les utilisateurs, les parties, les tournois, etc.
 */
import sqlite3 from 'sqlite3';
export declare const db: sqlite3.Database;
/**
 * Ferme la connexion à la base de données
 */
export declare function closeDatabase(): void;
