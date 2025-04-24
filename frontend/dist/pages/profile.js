/**
 * Page de profil utilisateur
 *
 * Cette page affiche les informations du profil de l'utilisateur,
 * ses statistiques de jeu et son historique de parties.
 */
import { userApi, gameApi, getCurrentUser } from '../services/api';
/**
 * Affiche la page de profil
 * @param container - Élément HTML dans lequel afficher la page
 */
export async function renderProfilePage(container) {
    // Afficher un indicateur de chargement
    container.innerHTML = `
    <div class="container mx-auto py-8 flex justify-center">
      <div class="loading-spinner"></div>
      <p class="ml-3">Chargement du profil...</p>
    </div>
  `;
    try {
        // Récupérer l'ID de l'utilisateur connecté
        const currentUser = getCurrentUser();
        if (!currentUser || !currentUser.id) {
            throw new Error('Utilisateur non connecté');
        }
        const userId = currentUser.id;
        // Récupérer les données en parallèle
        const [profileResponse, statsResponse, friendsResponse, gamesResponse] = await Promise.all([
            userApi.getProfile(userId),
            userApi.getPlayerStats(userId),
            userApi.getFriends(userId),
            gameApi.getGameHistory(userId)
        ]);
        const user = profileResponse.user;
        const stats = statsResponse.stats;
        const friends = friendsResponse.friends || [];
        const games = gamesResponse.games || [];
        // Trier les parties par date (la plus récente en premier)
        const recentGames = [...games].sort((a, b) => new Date(b.played_at).getTime() - new Date(a.played_at).getTime()).slice(0, 5); // Prendre les 5 dernières parties
        // Calculer le ratio de victoires
        const winRatio = stats.total_games > 0
            ? Math.round((stats.wins / stats.total_games) * 100)
            : 0;
        container.innerHTML = `
      <div class="container mx-auto py-8">
        <div class="card mb-6">
          <div class="flex flex-col md:flex-row">
            <div class="md:w-1/3 flex justify-center mb-4 md:mb-0">
              <div class="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                <img src="${user.avatar_url || 'https://via.placeholder.com/128'}" alt="Avatar" class="w-full h-full object-cover" />
              </div>
            </div>
            
            <div class="md:w-2/3">
              <h1 class="text-3xl font-bold mb-2">${user.username}</h1>
              <p class="text-gray-600 mb-4">@${user.username.toLowerCase()}</p>
              
              <div class="flex flex-wrap gap-4 mb-4">
                <div class="bg-gray-100 rounded-lg p-3 text-center">
                  <div class="text-2xl font-bold">${stats.total_games || 0}</div>
                  <div class="text-sm text-gray-600">Parties</div>
                </div>
                
                <div class="bg-gray-100 rounded-lg p-3 text-center">
                  <div class="text-2xl font-bold">${stats.wins || 0}</div>
                  <div class="text-sm text-gray-600">Victoires</div>
                </div>
                
                <div class="bg-gray-100 rounded-lg p-3 text-center">
                  <div class="text-2xl font-bold">${stats.losses || 0}</div>
                  <div class="text-sm text-gray-600">Défaites</div>
                </div>
                
                <div class="bg-gray-100 rounded-lg p-3 text-center">
                  <div class="text-2xl font-bold">${winRatio}%</div>
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
                  <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${stats.level_progress || 0}%"></div>
                </div>
                <div class="flex justify-between text-sm text-gray-600 mt-1">
                  <span>Niveau ${stats.level || 1}</span>
                  <span>${stats.level_progress || 0}% vers niveau ${(stats.level || 1) + 1}</span>
                </div>
              </div>
              
              <div>
                <h3 class="text-lg font-bold mb-2">Tournois</h3>
                <p>Participations: ${stats.tournament_participations || 0}</p>
                <p>Victoires: ${stats.tournament_wins || 0}</p>
                <p>Meilleur classement: ${stats.best_tournament_rank || 'Aucun'}</p>
              </div>
              
              <div>
                <h3 class="text-lg font-bold mb-2">Temps de jeu</h3>
                <p>Total: ${stats.total_play_time || '0h 0min'}</p>
                <p>Moyenne par partie: ${stats.average_game_time || '0min'}</p>
              </div>
            </div>
          </div>
          
          <div class="card">
            <h2 class="text-2xl font-bold mb-4">Historique des parties</h2>
            
            <div class="space-y-4">
              ${recentGames.length > 0 ? recentGames.map(game => `
                <div class="border-l-4 border-${game.winner_id === userId ? 'green' : 'red'}-500 pl-4 py-2">
                  <div class="flex justify-between">
                    <span class="font-bold">${game.winner_id === userId ? 'Victoire' : 'Défaite'} vs. ${game.opponent_username}</span>
                    <span class="text-sm text-gray-600">${new Date(game.played_at).toLocaleDateString()}</span>
                  </div>
                  <p>Score: ${game.user_score}-${game.opponent_score}</p>
                </div>
              `).join('') : '<p>Aucune partie jouée récemment</p>'}
            </div>
            
            <button id="view-all-history-btn" class="btn-secondary mt-4 w-full">Voir tout l'historique</button>
          </div>
        </div>
        
        <div class="card mt-6">
          <h2 class="text-2xl font-bold mb-4">Amis (${friends.length})</h2>
          ${friends.length > 0 ? `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              ${friends.map(friend => `
                <div class="flex items-center p-3 bg-gray-100 rounded-lg">
                  <div class="w-12 h-12 rounded-full overflow-hidden mr-3">
                    <img src="${friend.avatar_url || 'https://via.placeholder.com/48'}" alt="${friend.username}" class="w-full h-full object-cover">
                  </div>
                  <div>
                    <div class="font-bold">${friend.username}</div>
                    <div class="text-sm text-gray-600">Membre depuis ${new Date(friend.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : '<p>Vous n\'avez pas encore d\'amis. Ajoutez des amis pour jouer avec eux !</p>'}
        </div>
      </div>
    `;
        // Ajout des écouteurs d'événements
        document.getElementById('edit-profile-btn')?.addEventListener('click', () => {
            showEditProfileModal(user);
        });
        document.getElementById('change-avatar-btn')?.addEventListener('click', () => {
            showChangeAvatarModal(userId);
        });
        document.getElementById('view-all-history-btn')?.addEventListener('click', () => {
            showGameHistoryModal(userId, games);
        });
    }
    catch (error) {
        console.error('Erreur:', error);
        container.innerHTML = `
      <div class="container mx-auto py-8">
        <div class="card error-container p-6 text-center">
          <h2 class="text-2xl font-bold mb-4 text-red-600">Une erreur est survenue</h2>
          <p class="mb-4">${error.message || 'Impossible de charger les données du profil'}</p>
          <button id="retry-btn" class="btn-primary">Réessayer</button>
        </div>
      </div>
    `;
        document.getElementById('retry-btn')?.addEventListener('click', () => {
            renderProfilePage(container);
        });
    }
}
/**
 * Affiche une modale pour modifier le profil
 * @param user - Données de l'utilisateur
 */
function showEditProfileModal(user) {
    // Créer la modale
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="text-xl font-bold">Modifier le profil</h3>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <form id="edit-profile-form">
          <div class="form-group">
            <label for="username">Nom d'utilisateur</label>
            <input type="text" id="username" value="${user.username}" class="form-input" />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" value="${user.email}" class="form-input" />
          </div>
          <div class="form-group">
            <label for="password">Nouveau mot de passe (laisser vide pour ne pas changer)</label>
            <input type="password" id="password" class="form-input" />
          </div>
          <div id="form-error" class="text-red-500 mb-4 hidden"></div>
          <div class="flex justify-end gap-3">
            <button type="button" class="btn-secondary modal-cancel">Annuler</button>
            <button type="submit" class="btn-primary">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  `;
    document.body.appendChild(modal);
    // Gérer la fermeture de la modale
    const closeModal = () => {
        document.body.removeChild(modal);
    };
    modal.querySelector('.modal-close')?.addEventListener('click', closeModal);
    modal.querySelector('.modal-cancel')?.addEventListener('click', closeModal);
    // Gérer la soumission du formulaire
    document.getElementById('edit-profile-form')?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        try {
            const currentUser = getCurrentUser();
            if (!currentUser)
                throw new Error('Utilisateur non connecté');
            const updateData = { username, email };
            if (password)
                updateData.password = password;
            await userApi.updateProfile(currentUser.id, updateData);
            // Fermer la modale et rafraîchir la page
            closeModal();
            renderProfilePage(document.getElementById('app-container'));
        }
        catch (error) {
            const errorElement = document.getElementById('form-error');
            if (errorElement) {
                errorElement.textContent = error.message;
                errorElement.classList.remove('hidden');
            }
        }
    });
}
/**
 * Affiche une modale pour changer l'avatar
 * @param userId - ID de l'utilisateur
 */
function showChangeAvatarModal(userId) {
    // Implémentation à venir
    alert('Fonctionnalité de changement d\'avatar à implémenter');
}
/**
 * Affiche une modale avec l'historique complet des parties
 * @param userId - ID de l'utilisateur
 * @param games - Liste des parties
 */
function showGameHistoryModal(userId, games) {
    // Implémentation à venir
    alert('Fonctionnalité d\'affichage de l\'historique complet à implémenter');
}
//# sourceMappingURL=profile.js.map