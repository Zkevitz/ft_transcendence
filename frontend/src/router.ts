/**
 * Module de routage pour l'application
 * 
 * Ce module gère la navigation entre les différentes pages de l'application
 * sans rechargement complet de la page (SPA - Single Page Application).
 * 
 * Il permet de:
 * - Définir les routes de l'application
 * - Gérer les changements d'URL
 * - Charger les composants correspondants aux routes
 * - Gérer l'historique de navigation (boutons précédent/suivant du navigateur)
 */

// Type pour l'application
interface App {
  navigate: (path: string) => void;
  render: (component: string) => void;
}

// Type pour les routes
interface Route {
  path: string;
  component: string;
}

// Définition des routes de l'application
const routes: Route[] = [
  { path: '/', component: 'home' },
  { path: '/game', component: 'game' },
  { path: '/tournaments', component: 'tournaments' },
  { path: '/profile', component: 'profile' },
  { path: '/login', component: 'login' },
  { path: '/register', component: 'register' },
  // Route par défaut (404)
  { path: '*', component: 'not-found' }
];

/**
 * Initialise le routeur de l'application
 * @param app - L'instance de l'application
 */
export function initRouter(app: App): void {
  // Fonction pour trouver la route correspondant au chemin actuel
  const findRoute = (path: string): Route => {
    const route = routes.find(route => route.path === path);
    return route || routes.find(route => route.path === '*')!;
  };

  // Fonction pour naviguer vers une route
  const navigate = (path: string): void => {
    const route = findRoute(path);
    
    // Mise à jour de l'URL sans rechargement de la page
    window.history.pushState({}, '', path);
    
    // Rendu du composant correspondant à la route
    app.render(route.component);
  };

  // Gestion des liens internes pour la navigation SPA
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const anchor = target.closest('a');
    
    if (anchor && anchor.href.startsWith(window.location.origin)) {
      event.preventDefault();
      const path = anchor.pathname;
      navigate(path);
    }
  });

  // Gestion du bouton retour du navigateur
  window.addEventListener('popstate', () => {
    const path = window.location.pathname;
    const route = findRoute(path);
    app.render(route.component);
  });

  // Exposition de la fonction de navigation
  app.navigate = navigate;

  // Navigation initiale vers la route correspondant à l'URL actuelle
  const path = window.location.pathname;
  const route = findRoute(path);
  app.render(route.component);
}
