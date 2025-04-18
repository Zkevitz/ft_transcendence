/**
 * Page des tournois
 * 
 * Cette page affiche les tournois disponibles et permet à l'utilisateur
 * d'en rejoindre un ou d'en créer un nouveau.
 */

/**
 * Affiche la page des tournois
 * @param container - Élément HTML dans lequel afficher la page
 */
export function renderTournamentsPage(container: HTMLElement): void {
  container.innerHTML = `
    <div class="container mx-auto py-8">
      <div class="card mb-6">
        <h1 class="text-3xl font-bold mb-4">Tournois</h1>
        <p class="mb-6">Participez à des tournois pour affronter d'autres joueurs et grimper dans le classement.</p>
        
        <div class="flex flex-col md:flex-row gap-4 mb-6">
          <button id="create-tournament-btn" class="btn-primary">Créer un tournoi</button>
          <button id="refresh-tournaments-btn" class="btn-secondary">Actualiser la liste</button>
        </div>
      </div>
      
      <div class="card mb-6">
        <h2 class="text-2xl font-bold mb-4">Tournois en cours</h2>
        
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead>
              <tr class="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                <th class="py-3 px-6 text-left">Nom</th>
                <th class="py-3 px-6 text-left">Organisateur</th>
                <th class="py-3 px-6 text-center">Joueurs</th>
                <th class="py-3 px-6 text-center">Statut</th>
                <th class="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="text-gray-600 text-sm">
              <tr class="border-b border-gray-200 hover:bg-gray-50">
                <td class="py-3 px-6 text-left">Tournoi amical du week-end</td>
                <td class="py-3 px-6 text-left">JohnDoe</td>
                <td class="py-3 px-6 text-center">4/8</td>
                <td class="py-3 px-6 text-center">
                  <span class="bg-green-200 text-green-700 py-1 px-3 rounded-full text-xs">Inscription</span>
                </td>
                <td class="py-3 px-6 text-center">
                  <button class="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded text-xs">Rejoindre</button>
                </td>
              </tr>
              <tr class="border-b border-gray-200 hover:bg-gray-50">
                <td class="py-3 px-6 text-left">Championnat mensuel</td>
                <td class="py-3 px-6 text-left">Admin</td>
                <td class="py-3 px-6 text-center">16/16</td>
                <td class="py-3 px-6 text-center">
                  <span class="bg-yellow-200 text-yellow-700 py-1 px-3 rounded-full text-xs">En cours</span>
                </td>
                <td class="py-3 px-6 text-center">
                  <button class="bg-gray-300 text-gray-700 py-1 px-3 rounded text-xs cursor-not-allowed">Complet</button>
                </td>
              </tr>
              <tr class="border-b border-gray-200 hover:bg-gray-50">
                <td class="py-3 px-6 text-left">Tournoi des débutants</td>
                <td class="py-3 px-6 text-left">PongMaster</td>
                <td class="py-3 px-6 text-center">2/4</td>
                <td class="py-3 px-6 text-center">
                  <span class="bg-green-200 text-green-700 py-1 px-3 rounded-full text-xs">Inscription</span>
                </td>
                <td class="py-3 px-6 text-center">
                  <button class="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded text-xs">Rejoindre</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div class="card">
        <h2 class="text-2xl font-bold mb-4">Tournois à venir</h2>
        
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead>
              <tr class="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                <th class="py-3 px-6 text-left">Nom</th>
                <th class="py-3 px-6 text-left">Organisateur</th>
                <th class="py-3 px-6 text-center">Date</th>
                <th class="py-3 px-6 text-center">Places</th>
                <th class="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="text-gray-600 text-sm">
              <tr class="border-b border-gray-200 hover:bg-gray-50">
                <td class="py-3 px-6 text-left">Grand tournoi annuel</td>
                <td class="py-3 px-6 text-left">Admin</td>
                <td class="py-3 px-6 text-center">01/05/2025</td>
                <td class="py-3 px-6 text-center">32</td>
                <td class="py-3 px-6 text-center">
                  <button class="bg-purple-500 hover:bg-purple-700 text-white py-1 px-3 rounded text-xs">S'inscrire</button>
                </td>
              </tr>
              <tr class="border-b border-gray-200 hover:bg-gray-50">
                <td class="py-3 px-6 text-left">Tournoi éclair</td>
                <td class="py-3 px-6 text-left">SpeedMaster</td>
                <td class="py-3 px-6 text-center">15/04/2025</td>
                <td class="py-3 px-6 text-center">8</td>
                <td class="py-3 px-6 text-center">
                  <button class="bg-purple-500 hover:bg-purple-700 text-white py-1 px-3 rounded text-xs">S'inscrire</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  
  // Ajout des écouteurs d'événements
  document.getElementById('create-tournament-btn')?.addEventListener('click', () => {
    // Affichage d'une boîte de dialogue pour créer un tournoi
    alert('Fonctionnalité de création de tournoi à implémenter');
  });
  
  document.getElementById('refresh-tournaments-btn')?.addEventListener('click', () => {
    // Actualisation de la liste des tournois
    alert('Actualisation de la liste des tournois');
  });
}
