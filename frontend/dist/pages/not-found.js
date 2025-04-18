/**
 * Page 404 (Not Found)
 *
 * Cette page s'affiche lorsque l'utilisateur accède à une URL qui n'existe pas.
 * Elle offre un message d'erreur convivial et un lien pour retourner à l'accueil.
 */
/**
 * Affiche la page 404
 * @param container - Élément HTML dans lequel afficher la page
 */
export function renderNotFoundPage(container) {
    container.innerHTML = `
    <div class="container mx-auto py-8 text-center">
      <div class="card max-w-lg mx-auto">
        <h1 class="text-6xl font-bold text-primary-600 mb-4">404</h1>
        <h2 class="text-2xl font-bold mb-4">Page non trouvée</h2>
        
        <p class="mb-6 text-gray-600">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        
        <div class="mb-6">
          <svg class="w-64 h-64 mx-auto text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z"/>
          </svg>
        </div>
        
        <div>
          <a href="/" class="btn-primary inline-block">Retour à l'accueil</a>
        </div>
      </div>
    </div>
  `;
}
//# sourceMappingURL=not-found.js.map