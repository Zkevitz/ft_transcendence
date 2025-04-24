/**
 * Module principal de l'application
 * 
 * Ce module crée et configure l'application frontend.
 * Il fournit les fonctionnalités de base comme la navigation et le rendu des composants.
 * 
 * L'application suit une architecture modulaire pour faciliter la maintenance
 * et permettre l'ajout de nouvelles fonctionnalités.
 */

// Import des composants de page
import { renderHomePage } from './pages/home';
import { renderGamePage } from './pages/game';
import { renderTournamentsPage } from './pages/tournaments';
import { renderProfilePage } from './pages/profile';
import { renderLoginPage } from './pages/login';
import { renderRegisterPage } from './pages/register';
import { renderNotFoundPage } from './pages/not-found';

// Type pour l'application
interface App {
  navigate: (path: string) => void;
  render: (component: string) => void;
}

/**
 * Crée une instance de l'application
 * @returns L'instance de l'application
 */
export function createApp(): App {
  // Création de l'objet application
  const app: App = {
    // Fonction de navigation (sera définie par le routeur)
    navigate: (path: string) => {
      console.warn('Navigation non initialisée');
    },
    
    // Fonction de rendu des composants
    render: (component: string) => {
      // Récupération de l'élément principal de l'application
      const mainElement = document.getElementById('app-container');
      if (!mainElement) {
        console.error("L'élément #app-container n'a pas été trouvé dans le DOM");
        return;
      }
      
      // Rendu du composant en fonction de son nom
      switch (component) {
        case 'home':
          renderHomePage(mainElement);
          break;
        case 'game':
          renderGamePage(mainElement);
          break;
        case 'tournaments':
          renderTournamentsPage(mainElement);
          break;
        case 'profile':
          renderProfilePage(mainElement);
          break;
        case 'login':
          renderLoginPage(mainElement);
          break;
        case 'register':
          renderRegisterPage(mainElement);
          break;
        case 'not-found':
          renderNotFoundPage(mainElement);
          break;
        default:
          console.error(`Composant inconnu: ${component}`);
          renderNotFoundPage(mainElement);
      }
    }
  };
  
  return app;
}
