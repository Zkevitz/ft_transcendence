/**
 * Page de connexion
 * 
 * Cette page permet à l'utilisateur de se connecter à son compte.
 * Elle offre également la possibilité de se connecter via Google (OAuth).
 */

import { userApi } from '../services/api';
import { router } from '../router';

/**
 * Interface pour la réponse de connexion
 */
interface LoginResponse {
  user: {
    id: number;
    username: string;
    email: string;
    avatar_url?: string;
  };
  token: string;
}

/**
 * Affiche la page de connexion
 * @param container - Élément HTML dans lequel afficher la page
 */
export function renderLoginPage(container: HTMLElement): void {
  console.log('Rendering login page');
  
  // Fonction pour gérer la connexion
  async function handleLogin(email: string, password: string) {
    console.log('handleLogin called with:', email);
    
    try {
      // Afficher un message de chargement
      const statusDiv = document.getElementById('login-status');
      if (statusDiv) {
        statusDiv.textContent = 'Connexion en cours...';
        statusDiv.classList.remove('hidden');
        statusDiv.classList.remove('text-red-500');
        statusDiv.classList.add('text-blue-500');
      }
      
      // Utilisation du service API pour la connexion
      const response = await userApi.login({ email, password });
      
      // Stockage du token et des informations utilisateur dans le localStorage
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      console.log('Connexion réussie:', response.user.username);
      
      if (statusDiv) {
        statusDiv.textContent = 'Connexion réussie! Redirection...';
        statusDiv.classList.remove('text-red-500');
        statusDiv.classList.add('text-green-500');
      }
      
      // Redirection vers la page d'accueil après connexion réussie
      setTimeout(() => {
        router.navigate('/');
      }, 1000);
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      const statusDiv = document.getElementById('login-status');
      if (statusDiv) {
        statusDiv.textContent = error.message || 'Erreur lors de la connexion';
        statusDiv.classList.remove('text-blue-500');
        statusDiv.classList.add('text-red-500');
      }
    }
  }
  
  container.innerHTML = `
    <div class="container mx-auto py-8">
      <div class="max-w-md mx-auto card">
        <h1 class="text-3xl font-bold mb-6 text-center">Connexion</h1>
        
        <form id="login-form" class="space-y-4">
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
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded">
              <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                Se souvenir de moi
              </label>
            </div>
            <div class="text-sm">
              <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
                Mot de passe oublié?
              </a>
            </div>
          </div>
          
          <div id="login-status" class="text-red-500 text-sm hidden"></div>
          
          <div>
            <button type="submit" class="w-full btn-primary">
              Se connecter
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
                Ou continuer avec
              </span>
            </div>
          </div>
          
          <div class="mt-6">
            <button id="google-login-btn" class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" class="h-5 w-5 mr-2">
              Se connecter avec Google
            </button>
          </div>
        </div>
        
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Pas encore de compte?
            <a href="/register" class="font-medium text-primary-600 hover:text-primary-500">
              S'inscrire
            </a>
          </p>
        </div>
      </div>
    </div>
  `;
  
  // Ajout des écouteurs d'événements
  const form = document.getElementById('login-form');
  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const emailInput = document.getElementById('email') as HTMLInputElement;
      const passwordInput = document.getElementById('password') as HTMLInputElement;
      
      const email = emailInput?.value || '';
      const password = passwordInput?.value || '';
      
      if (!email || !password) {
        const statusDiv = document.getElementById('login-status');
        if (statusDiv) {
          statusDiv.textContent = 'Veuillez remplir tous les champs';
          statusDiv.classList.remove('hidden');
        }
        return;
      }
      
      handleLogin(email, password);
    });
  }
  
  // Écouteur pour le bouton Google
  const googleButton = document.getElementById('google-login-btn');
  if (googleButton) {
    googleButton.addEventListener('click', function() {
      alert('Connexion avec Google à implémenter');
    });
  }
}
