/**
 * Page d'inscription
 * 
 * Cette page permet à l'utilisateur de créer un nouveau compte.
 * Elle inclut un formulaire d'inscription avec validation des champs.
 */

// URL de l'API backend
const API_URL = 'http://localhost:3000/api';

/**
 * Interface pour la réponse d'inscription
 */
interface RegisterResponse {
  user: {
    id: number;
    username: string;
    email: string;
    avatar_url?: string;
  };
  token: string;
}

/**
 * Affiche la page d'inscription
 * @param container - Élément HTML dans lequel afficher la page
 */
export function renderRegisterPage(container: HTMLElement): void {
  console.log('Rendering register page');
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
          
          <div id="error-message" class="text-red-500 text-sm hidden"></div>
          
          <div>
            <button type="submit" class="w-full btn-primary" id="register-button">
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
  //'register form + Form element ligne 34 - 81 
  const form = document.getElementById('register-form');
  console.log('Form element:', form);
  
  if (form) {
    form.addEventListener('submit', async (event) => {
      console.log('Form submitted');
      event.preventDefault();
      
      // Récupération des valeurs du formulaire
      const usernameInput = document.getElementById('username') as HTMLInputElement;
      const emailInput = document.getElementById('email') as HTMLInputElement;
      const passwordInput = document.getElementById('password') as HTMLInputElement;
      const confirmPasswordInput = document.getElementById('confirm-password') as HTMLInputElement;
      const termsInput = document.getElementById('terms') as HTMLInputElement;
      const errorMessage = document.getElementById('error-message');
      const registerButton = document.getElementById('register-button');
      
      const username = usernameInput.value;
      const email = emailInput.value;
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;
      const termsAccepted = termsInput.checked;
      
      // Validation basique côté client
      if (!username || !email || !password || !confirmPassword) {
        showError('Veuillez remplir tous les champs');
        return;
      }
      
      if (password !== confirmPassword) {
        showError('Les mots de passe ne correspondent pas');
        return;
      }
      
      if (password.length < 8) {
        showError('Le mot de passe doit contenir au moins 8 caractères');
        return;
      }
      
      if (!termsAccepted) {
        showError('Vous devez accepter les conditions d\'utilisation');
        return;
      }
      
      // Fonction pour afficher les erreurs
      function showError(message: string) {
        if (errorMessage) {
          errorMessage.textContent = message;
          errorMessage.classList.remove('hidden');
        } else {
          alert(message);
        }
      }
      
      try {
        // Désactiver le bouton pendant la requête
        if (registerButton) {
          registerButton.textContent = 'Inscription en cours...';
          registerButton.setAttribute('disabled', 'true');
        }
        
        // Envoi de la requête d'inscription à l'API
        const response = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            email,
            password
          })
        });
        
        // Traitement de la réponse
        if (response.ok) {
          const data: RegisterResponse = await response.json();
          
          // Stockage du token dans le localStorage pour l'authentification
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('user_id', data.user.id.toString());
          localStorage.setItem('username', data.user.username);
          
          // Redirection vers la page d'accueil après inscription réussie
          window.location.href = '/';
        } else {
          const errorData = await response.json();
          showError(errorData.error || 'Erreur lors de l\'inscription');
        }
      } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        showError('Erreur de connexion au serveur');
      } finally {
        // Réactiver le bouton
        if (registerButton) {
          registerButton.textContent = 'S\'inscrire';
          registerButton.removeAttribute('disabled');
        }
      }
    });
  }
  
  document.getElementById('google-register-btn')?.addEventListener('click', () => {
    // Simulation d'inscription avec Google (à implémenter avec l'API Google)
    alert('Inscription avec Google à implémenter');
  });
}
