/**
 * Page d'inscription
 * 
 * Cette page permet à l'utilisateur de créer un nouveau compte.
 * Elle inclut un formulaire d'inscription avec validation des champs.
 */

/**
 * Affiche la page d'inscription
 * @param container - Élément HTML dans lequel afficher la page
 */
export function renderRegisterPage(container: HTMLElement): void {
  container.innerHTML = `
    <div class="container mx-auto py-8">
      <div class="max-w-md mx-auto card">
        <h1 class="text-3xl font-bold mb-6 text-center">Créer un compte</h1>
        
        <form id="register-form" class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
            <input type="text" id="username" name="username" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="PongMaster42">
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" id="email" name="email" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="votre@email.com">
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input type="password" id="password" name="password" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="••••••••">
            <p class="mt-1 text-xs text-gray-500">
              Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.
            </p>
          </div>
          
          <div>
            <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
            <input type="password" id="confirm-password" name="confirm-password" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="••••••••">
          </div>
          
          <div class="flex items-center">
            <input id="terms" name="terms" type="checkbox" required
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded">
            <label for="terms" class="ml-2 block text-sm text-gray-700">
              J'accepte les <a href="#" class="text-primary-600 hover:text-primary-500">conditions d'utilisation</a> et la <a href="#" class="text-primary-600 hover:text-primary-500">politique de confidentialité</a>
            </label>
          </div>
          
          <div>
            <button type="submit" class="w-full btn-primary">
              S'inscrire
            </button>
          </div>
        </form>
        
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">
                Ou s'inscrire avec
              </span>
            </div>
          </div>
          
          <div class="mt-6">
            <button id="google-register-btn" class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" class="h-5 w-5 mr-2">
              S'inscrire avec Google
            </button>
          </div>
        </div>
        
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Déjà un compte?
            <a href="/login" class="font-medium text-primary-600 hover:text-primary-500">
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  `;
  
  // Ajout des écouteurs d'événements
  document.getElementById('register-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    
    // Récupération des valeurs du formulaire
    const usernameInput = document.getElementById('username') as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const confirmPasswordInput = document.getElementById('confirm-password') as HTMLInputElement;
    const termsInput = document.getElementById('terms') as HTMLInputElement;
    
    const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const termsAccepted = termsInput.checked;
    
    // Validation basique côté client
    if (!username || !email || !password || !confirmPassword) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (password.length < 8) {
      alert('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    
    if (!termsAccepted) {
      alert('Vous devez accepter les conditions d\'utilisation');
      return;
    }
    
    // Simulation d'inscription (à remplacer par une vraie requête API)
    console.log('Tentative d\'inscription avec:', { username, email, password });
    
    // Redirection vers la page de connexion après inscription réussie
    setTimeout(() => {
      window.location.href = '/login';
    }, 1000);
  });
  
  document.getElementById('google-register-btn')?.addEventListener('click', () => {
    // Simulation d'inscription avec Google (à implémenter avec l'API Google)
    alert('Inscription avec Google à implémenter');
  });
}
