/**
 * Fichier principal du frontend
 * 
 * Ce fichier est le point d'entrée de l'application frontend.
 * Il initialise l'application, configure les routes et monte l'application dans le DOM.
 * 
 * L'application utilise une architecture modulaire pour faciliter la maintenance
 * et permettre l'ajout de nouvelles fonctionnalités.
 */

// Import des styles
console.log("bonjour")
import './styles/main.css';

// Import des modules et composants
import { initRouter } from './router';
import { createApp } from './app';
import { initializeGameEngine } from './game/engine';

/**
 * Fonction d'initialisation de l'application
 * Cette fonction est appelée au chargement de la page
 */
async function initApp() {
  try {
    // Création de l'application
    const app = createApp();
    
    // Initialisation du routeur
    initRouter(app);
    
    // Initialisation du moteur de jeu
    initializeGameEngine();
    
    // Montage de l'application dans le DOM
    const appElement = document.getElementById('app');
    if (!appElement) {
      throw new Error("L'élément #app n'a pas été trouvé dans le DOM");
    }
    
    // Affichage du contenu initial
    appElement.innerHTML = `
      <header class="bg-primary-600 text-white p-4 shadow-md">
        <div class="container mx-auto flex justify-between items-center">
          <h1 class="text-2xl font-bold">ft_transcendence</h1>
          <nav class="hidden md:block">
            <ul class="flex space-x-4">
              <li><a href="/" class="hover:text-primary-200">Accueil</a></li>
              <li><a href="/game" class="hover:text-primary-200">Jouer</a></li>
              <li><a href="/tournaments" class="hover:text-primary-200">Tournois</a></li>
              <li><a href="/profile" class="hover:text-primary-200">Profil</a></li>
            </ul>
          </nav>
          <button id="login-btn" class="btn-secondary">Connexion</button>
        </div>
      </header>
      
      <main class="container mx-auto p-4 flex-grow">
        <div class="card my-8">
          <h2 class="text-2xl font-bold mb-4">Bienvenue sur ft_transcendence</h2>
          <p class="mb-4">Le jeu de Pong ultime où vous pouvez défier vos amis et participer à des tournois en ligne.</p>
          <div class="flex space-x-4 mt-6">
            <button id="play-btn" class="btn-primary">Jouer maintenant</button>
            <button id="learn-btn" class="btn-secondary">En savoir plus</button>
          </div>
        </div>
      </main>
      
      <footer class="bg-gray-800 text-white p-4 mt-auto">
        <div class="container mx-auto text-center">
          <p>&copy; 2025 ft_transcendence - Tous droits réservés</p>
        </div>
      </footer>
    `;
    
    // Ajout des écouteurs d'événements
    document.getElementById('play-btn')?.addEventListener('click', () => {
      window.location.href = '/game';
    });
    
    document.getElementById('login-btn')?.addEventListener('click', () => {
      window.location.href = '/login';
    });
    
    console.log('Application initialisée avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de l\'application:', error);
  }
}

// Initialisation de l'application au chargement de la page
document.addEventListener('DOMContentLoaded', initApp);
