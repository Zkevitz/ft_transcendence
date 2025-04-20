/**
 * Page de jeu Pong
 *
 * Cette page contient le jeu Pong lui-même.
 * Elle initialise le canvas de jeu et démarre la partie.
 */
import { startGame, stopGame } from '../game/engine';
/**
 * Affiche la page de jeu
 * @param container - Élément HTML dans lequel afficher la page
 */
export function renderGamePage(container) {
    container.innerHTML = `
    <div class="container mx-auto py-8">
      <div class="card mb-6">
        <h1 class="text-3xl font-bold mb-4">Jouer à Pong</h1>
        
        <div class="flex flex-col md:flex-row gap-4 mb-6">
          <button id="start-game-btn" class="btn-primary">Démarrer une partie</button>
          <button id="stop-game-btn" class="btn-secondary" disabled>Arrêter la partie</button>
        </div>
        
        <div class="mb-4">
          <h2 class="text-xl font-bold mb-2">Contrôles</h2>
          <ul class="list-disc pl-5">
            <li>Joueur 1 (gauche): Touches W (haut) et S (bas)</li>
            <li>Joueur 2 (droite): Touches flèche haut et flèche bas</li>
            <li>Pause: Touche Espace</li>
          </ul>
        </div>
      </div>
      
      <div class="card">
        <div class="flex justify-center">
          <canvas id="pong-canvas" width="800" height="400" class="pong-field border-2 border-gray-300"></canvas>
        </div>
        
        <div class="mt-6 flex justify-between">
          <div>
            <h3 class="text-lg font-bold">Joueur 1</h3>
            <p id="player1-score">Score: 0</p>
          </div>
          
          <div>
            <h3 class="text-lg font-bold">Joueur 2</h3>
            <p id="player2-score">Score: 0</p>
          </div>
        </div>
      </div>
    </div>
  `;
    // Récupération des éléments du DOM
    const startGameBtn = document.getElementById('start-game-btn');
    const stopGameBtn = document.getElementById('stop-game-btn');
    // Ajout des écouteurs d'événements
    startGameBtn?.addEventListener('click', () => {
        // Démarrage de la partie
        startGame('pong-canvas');
        // Mise à jour des boutons
        startGameBtn.disabled = true;
        stopGameBtn.disabled = false;
    });
    stopGameBtn?.addEventListener('click', () => {
        // Arrêt de la partie
        stopGame();
        // Mise à jour des boutons
        startGameBtn.disabled = false;
        stopGameBtn.disabled = true;
    });
    // Nettoyage lors du changement de page
    // Si besoin d'une fonction de nettoyage, il faut changer la signature de renderGamePage
    // ou appeler stopGame() ailleurs. Ici, on ne retourne rien.
    // stopGame(); // <-- Appeler ici si tu veux arrêter le jeu immédiatement
}
//# sourceMappingURL=game.js.map