/**
 * Page de profil utilisateur
 *
 * Cette page affiche les informations du profil de l'utilisateur,
 * ses statistiques de jeu et son historique de parties.
 */
/**
 * Affiche la page de profil
 * @param container - Élément HTML dans lequel afficher la page
 */
export function renderProfilePage(container) {
    container.innerHTML = `
    <div class="container mx-auto py-8">
      <div class="card mb-6">
        <div class="flex flex-col md:flex-row">
          <div class="md:w-1/3 flex justify-center mb-4 md:mb-0">
            <div class="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
              <img src="https://via.placeholder.com/128" alt="Avatar" class="w-full h-full object-cover" />
            </div>
          </div>
          
          <div class="md:w-2/3">
            <h1 class="text-3xl font-bold mb-2">John Doe</h1>
            <p class="text-gray-600 mb-4">@johndoe</p>
            
            <div class="flex flex-wrap gap-4 mb-4">
              <div class="bg-gray-100 rounded-lg p-3 text-center">
                <div class="text-2xl font-bold">42</div>
                <div class="text-sm text-gray-600">Parties</div>
              </div>
              
              <div class="bg-gray-100 rounded-lg p-3 text-center">
                <div class="text-2xl font-bold">28</div>
                <div class="text-sm text-gray-600">Victoires</div>
              </div>
              
              <div class="bg-gray-100 rounded-lg p-3 text-center">
                <div class="text-2xl font-bold">14</div>
                <div class="text-sm text-gray-600">Défaites</div>
              </div>
              
              <div class="bg-gray-100 rounded-lg p-3 text-center">
                <div class="text-2xl font-bold">67%</div>
                <div class="text-sm text-gray-600">Ratio</div>
              </div>
            </div>
            
            <div class="flex gap-4">
              <button id="edit-profile-btn" class="btn-primary">Modifier le profil</button>
              <button id="change-avatar-btn" class="btn-secondary">Changer d'avatar</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="card">
          <h2 class="text-2xl font-bold mb-4">Statistiques</h2>
          
          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-bold mb-2">Niveau</h3>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="bg-blue-600 h-2.5 rounded-full" style="width: 65%"></div>
              </div>
              <div class="flex justify-between text-sm text-gray-600 mt-1">
                <span>Niveau 6</span>
                <span>65% vers niveau 7</span>
              </div>
            </div>
            
            <div>
              <h3 class="text-lg font-bold mb-2">Tournois</h3>
              <p>Participations: 5</p>
              <p>Victoires: 1</p>
              <p>Meilleur classement: 2ème place</p>
            </div>
            
            <div>
              <h3 class="text-lg font-bold mb-2">Temps de jeu</h3>
              <p>Total: 15h 42min</p>
              <p>Moyenne par partie: 22min</p>
            </div>
          </div>
        </div>
        
        <div class="card">
          <h2 class="text-2xl font-bold mb-4">Historique des parties</h2>
          
          <div class="space-y-4">
            <div class="border-l-4 border-green-500 pl-4 py-2">
              <div class="flex justify-between">
                <span class="font-bold">Victoire vs. Alice</span>
                <span class="text-sm text-gray-600">15/04/2025</span>
              </div>
              <p>Score: 11-7</p>
            </div>
            
            <div class="border-l-4 border-green-500 pl-4 py-2">
              <div class="flex justify-between">
                <span class="font-bold">Victoire vs. Bob</span>
                <span class="text-sm text-gray-600">14/04/2025</span>
              </div>
              <p>Score: 11-5</p>
            </div>
            
            <div class="border-l-4 border-red-500 pl-4 py-2">
              <div class="flex justify-between">
                <span class="font-bold">Défaite vs. Charlie</span>
                <span class="text-sm text-gray-600">12/04/2025</span>
              </div>
              <p>Score: 9-11</p>
            </div>
            
            <div class="border-l-4 border-green-500 pl-4 py-2">
              <div class="flex justify-between">
                <span class="font-bold">Victoire vs. Dave</span>
                <span class="text-sm text-gray-600">10/04/2025</span>
              </div>
              <p>Score: 11-3</p>
            </div>
            
            <div class="border-l-4 border-red-500 pl-4 py-2">
              <div class="flex justify-between">
                <span class="font-bold">Défaite vs. Eve</span>
                <span class="text-sm text-gray-600">08/04/2025</span>
              </div>
              <p>Score: 7-11</p>
            </div>
          </div>
          
          <button id="view-all-history-btn" class="btn-secondary mt-4 w-full">Voir tout l'historique</button>
        </div>
      </div>
    </div>
  `;
    // Ajout des écouteurs d'événements
    document.getElementById('edit-profile-btn')?.addEventListener('click', () => {
        alert('Fonctionnalité de modification de profil à implémenter');
    });
    document.getElementById('change-avatar-btn')?.addEventListener('click', () => {
        alert('Fonctionnalité de changement d\'avatar à implémenter');
    });
    document.getElementById('view-all-history-btn')?.addEventListener('click', () => {
        alert('Fonctionnalité d\'affichage de l\'historique complet à implémenter');
    });
}
//# sourceMappingURL=profile.js.map