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
console.log("bonjour");
import './styles/main.css';
// Import des modules et composants
import { router } from './router';
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
        // Montage de l'application dans le DOM
        const appElement = document.getElementById('app');
        if (!appElement) {
            throw new Error("L'élément #app n'a pas été trouvé dans le DOM");
        }
        // Vérifier si l'utilisateur est connecté
        const userStr = localStorage.getItem('user');
        const isLoggedIn = !!userStr;
        // Affichage du contenu initial
        appElement.innerHTML = `
      <header class="bg-primary-600 text-white p-4 shadow-md">
        <div class="container mx-auto flex justify-between items-center">
          <h1 class="text-2xl font-bold">ft_transcendence</h1>
          <nav class="hidden md:block">
            <ul class="flex space-x-4">
              <li><a href="/" class="hover:text-primary-200">Accueil</a></li>
              <li><a href="/game" class="hover:text-primary-200" id="play-game-link">Jouer</a></li>
              <li><a href="/tournaments" class="hover:text-primary-200">Tournois</a></li>
              ${isLoggedIn ? `<li><a href="/profile" class="hover:text-primary-200">Profil</a></li>` : ''}
              ${!isLoggedIn ? `<li><a href="/register" class="hover:text-primary-200">S'inscrire</a></li>` : ''}
            </ul>
          </nav>
          ${isLoggedIn
            ? `<button id="logout-btn" class="btn-secondary">Déconnexion</button>`
            : `<button id="login-btn" class="btn-secondary">Connexion</button>`}
        </div>
      </header>
      
      <main id="app-container" class="container mx-auto p-4 flex-grow">
        <!-- Le contenu sera injecté ici par le routeur -->
      </main>
      
      <footer class="bg-gray-800 text-white p-4 mt-auto">
        <div class="container mx-auto text-center">
          <p>&copy; 2025 ft_transcendence. Tous droits réservés.</p>
        </div>
      </footer>
    `;
        // S'assurer que l'élément app-container existe avant d'initialiser le routeur
        const appContainer = document.getElementById('app-container');
        if (!appContainer) {
            console.error("L'élément #app-container n'a pas été trouvé dans le DOM après insertion");
            return;
        }
        // Initialisation du routeur avec notre application APRÈS création de l'élément app-container
        router.init(app);
        // Initialisation du moteur de jeu
        initializeGameEngine();
        // Ajouter des écouteurs d'événements après que le contenu HTML a été inséré
        const playGameLink = document.getElementById('play-game-link');
        if (playGameLink) {
            playGameLink.addEventListener('click', (event) => {
                event.preventDefault(); // Empêche la navigation par défaut
                // Votre code pour gérer le clic sur le lien "Jouer"
                console.log('Lien Jouer cliqué');
                // Utiliser le routeur pour naviguer vers la page du jeu
                router.navigate('/game');
            });
        }
        else {
            console.log('playGameLink introuvable');
        }
        // Ajout des écouteurs d'événements
        document.getElementById('login-btn')?.addEventListener('click', () => {
            router.navigate('/login');
        });
        document.getElementById('logout-btn')?.addEventListener('click', () => {
            // Supprimer les informations d'authentification
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            // Rediriger vers la page d'accueil
            router.navigate('/');
            // Recharger la page pour mettre à jour l'interface
            setTimeout(() => {
                window.location.reload();
            }, 100);
        });
        console.log('Application initialisée avec succès');
    }
    catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'application:', error);
    }
}
// Initialisation de l'application au chargement de la page
document.addEventListener('DOMContentLoaded', initApp);
//# sourceMappingURL=main.js.map