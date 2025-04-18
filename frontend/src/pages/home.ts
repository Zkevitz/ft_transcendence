/**
 * Page d'accueil
 * 
 * Cette page est la première que l'utilisateur voit en arrivant sur le site.
 * Elle présente le jeu Pong et les fonctionnalités principales du site.
 */

/**
 * Affiche la page d'accueil
 * @param container - Élément HTML dans lequel afficher la page
 */
export function renderHomePage(container: HTMLElement): void {
  container.innerHTML = `
    <div class="container mx-auto py-8">
      <div class="card mb-8">
        <h1 class="text-3xl font-bold mb-4">Bienvenue sur ft_transcendence</h1>
        <p class="mb-4">Le jeu de Pong ultime où vous pouvez défier vos amis et participer à des tournois en ligne.</p>
        
        <div class="mt-6 flex flex-col md:flex-row gap-4">
          <button id="play-now-btn" class="btn-primary">Jouer maintenant</button>
          <button id="join-tournament-btn" class="btn-secondary">Rejoindre un tournoi</button>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card">
          <h2 class="text-xl font-bold mb-2">Jouez en ligne</h2>
          <p>Affrontez des joueurs du monde entier en temps réel et améliorez vos compétences.</p>
        </div>
        
        <div class="card">
          <h2 class="text-xl font-bold mb-2">Tournois</h2>
          <p>Participez à des tournois réguliers et grimpez dans le classement pour devenir le champion.</p>
        </div>
        
        <div class="card">
          <h2 class="text-xl font-bold mb-2">Statistiques</h2>
          <p>Suivez vos performances et votre progression avec des statistiques détaillées.</p>
        </div>
      </div>
      
      <div class="card mt-8">
        <h2 class="text-2xl font-bold mb-4">Comment jouer</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-bold mb-2">Contrôles</h3>
            <ul class="list-disc pl-5">
              <li>Joueur 1 (gauche): Touches W (haut) et S (bas)</li>
              <li>Joueur 2 (droite): Touches flèche haut et flèche bas</li>
              <li>Pause: Touche Espace</li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-lg font-bold mb-2">Règles</h3>
            <ul class="list-disc pl-5">
              <li>Marquez des points en faisant passer la balle derrière la raquette adverse</li>
              <li>La balle accélère à chaque rebond sur une raquette</li>
              <li>Le premier joueur à atteindre 11 points remporte la partie</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Ajout des écouteurs d'événements
  document.getElementById('play-now-btn')?.addEventListener('click', () => {
    window.location.href = '/game';
  });
  
  document.getElementById('join-tournament-btn')?.addEventListener('click', () => {
    window.location.href = '/tournaments';
  });
}
