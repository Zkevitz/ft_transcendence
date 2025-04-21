/**
 * Page de connexion
 *
 * Cette page permet à l'utilisateur de se connecter à son compte.
 * Elle offre également la possibilité de se connecter via Google (OAuth).
 */
// URL de l'API backend
const API_URL = 'http://localhost:3000/api';
/**
 * Affiche la page de connexion
 * @param container - Élément HTML dans lequel afficher la page
 */
export function renderLoginPage(container) {
    console.log('Rendering login page');
    // Fonction pour gérer la connexion
    async function handleLogin(email, password) {
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
            // Envoi de la requête de connexion à l'API
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });
            // Traitement de la réponse
            if (response.ok) {
                const data = await response.json();
                // Stockage du token dans le localStorage pour l'authentification
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('user_id', data.user.id.toString());
                localStorage.setItem('username', data.user.username);
                console.log('Connexion réussie:', data.user.username);
                if (statusDiv) {
                    statusDiv.textContent = 'Connexion réussie! Redirection...';
                    statusDiv.classList.remove('text-red-500');
                    statusDiv.classList.add('text-green-500');
                }
                // Redirection vers la page d'accueil après connexion réussie
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            }
            else {
                const errorData = await response.json();
                if (statusDiv) {
                    statusDiv.textContent = errorData.error || 'Erreur lors de la connexion';
                    statusDiv.classList.remove('text-blue-500');
                    statusDiv.classList.add('text-red-500');
                }
            }
        }
        catch (error) {
            console.error('Erreur lors de la connexion:', error);
            const statusDiv = document.getElementById('login-status');
            if (statusDiv) {
                statusDiv.textContent = 'Erreur de connexion au serveur';
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
            <button type="button" id="login-button" class="w-full btn-primary">
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
    // Ajout des écouteurs d'événements après le rendu du HTML
    setTimeout(() => {
        console.log('Setting up event listeners');
        // Récupération des éléments du formulaire
        const loginButton = document.getElementById('login-button');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        console.log('Login button:', loginButton);
        console.log('Email input:', emailInput);
        console.log('Password input:', passwordInput);
        // Ajout de l'écouteur d'événement sur le bouton de connexion
        if (loginButton) {
            loginButton.onclick = function (event) {
                event.preventDefault();
                console.log('Login button clicked');
                const email = emailInput?.value || '';
                const password = passwordInput?.value || '';
                console.log('Email:', email);
                console.log('Password length:', password.length);
                if (!email || !password) {
                    const statusDiv = document.getElementById('login-status');
                    if (statusDiv) {
                        statusDiv.textContent = 'Veuillez remplir tous les champs';
                        statusDiv.classList.remove('hidden');
                    }
                    return;
                }
                handleLogin(email, password);
            };
        }
        // Ajout de l'écouteur d'événement sur le formulaire
        const form = document.getElementById('login-form');
        if (form) {
            form.onsubmit = function (event) {
                event.preventDefault();
                console.log('Form submitted');
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
            };
        }
        // Écouteur pour le bouton Google
        const googleButton = document.getElementById('google-login-btn');
        if (googleButton) {
            googleButton.onclick = function () {
                alert('Connexion avec Google à implémenter');
            };
        }
    }, 100); // Petit délai pour s'assurer que le DOM est bien chargé
}
//# sourceMappingURL=login.js.map