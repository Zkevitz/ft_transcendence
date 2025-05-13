import { renderLoginPage } from "./login";
import { router } from '../router';
import { authenticateUser } from "../auth";

/**
 * Affiche la page des tournois
 * @param container - Élément HTML dans lequel afficher la page
 */
export function renderTrainingPage(container: HTMLElement): void {
    const userstr = authenticateUser()
    if(!userstr)
        renderLoginPage(container)

    // Ajouter le contenu HTML de la page
    container.innerHTML = `
    <h1 class="text-3xl font-bold mb-4">Messagerie</h1>
    <div id="messages" class="messages-container"></div>
    <input type="text" id="messageInput" placeholder="Tapez votre message" class="w-full p-2 border border-gray-300 rounded mb-4" />
    <button id="sendButton" class="bg-blue-500 text-white p-2 rounded">Envoyer</button>
  `;

    // Sélectionner l'élément de la messagerie
    const MessagerieContainer = document.getElementById('messages') as HTMLDivElement;
    if (!MessagerieContainer) {
        console.error("L'élément de messagerie est introuvable.");
        return;
    }

    // Initialiser la connexion WebSocket
    return
    const ws = new WebSocket('ws://localhost:3000/ws/chat', JWTtoken);

    // Gérer les messages entrants
    ws.onmessage = (event) => {
        console.log('Message reçu :', event.data);

        // Vérifier si le message est en JSON
        let message = event.data;
        try {
            // Tenter de parser le message si c'est un JSON
            message = JSON.parse(event.data);
            console.log('Message parsé :', message);
        } catch (error) {
            console.log('Message brut, pas de JSON');
        }

        // Créer un élément de message avec les classes CSS
        const messageElement = document.createElement('div');
        messageElement.className = 'message-item message-received';
        
        // Afficher le contenu du message
        messageElement.textContent = typeof message === 'object' ? JSON.stringify(message) : message.toString();

        // Vérification si l'élément a bien été créé
        console.log('Message à ajouter :', messageElement);
        console.log('Message à ajouter :', MessagerieContainer);

        // Ajouter l'élément dans le conteneur
        if (MessagerieContainer) {
            console.log('Ajout du message dans le container');
            MessagerieContainer.appendChild(messageElement);
            
            // Faire défiler automatiquement vers le bas pour voir les nouveaux messages
            MessagerieContainer.scrollTop = MessagerieContainer.scrollHeight;
        }
    };

    // Gérer l'ouverture de la connexion WebSocket
    ws.onopen = () => {
        console.log('Connexion WebSocket ouverte');
        ws.send('NOUVELLE CONNEXION SUR LA MESSAGERIE');
    };

    // Gérer les erreurs WebSocket
    ws.onerror = (error) => {
        console.error('Erreur WebSocket:', error);
    };

    // Gérer la fermeture de la connexion WebSocket
    ws.onclose = (event) => {
        console.log('Connexion WebSocket fermée', event);
    };

    // Gérer l'envoi de message
    const sendButton = document.getElementById('sendButton') as HTMLButtonElement;
    const messageInput = document.getElementById('messageInput') as HTMLInputElement;

    if (!sendButton || !messageInput) {
        console.error("Le bouton ou le champ de message est introuvable.");
        return;
    }

    sendButton.addEventListener('click', () => {
        console.log("Bouton d'envoi de message déclenché");

        const message = messageInput.value;
        if (message) {
            console.log("Envoi du message :", message);
            ws.send(message);
            
            // Afficher localement le message envoyé
            const messageElement = document.createElement('div');
            messageElement.className = 'message-item message-sent';
            
            // Ajouter un préfixe pour indiquer que c'est votre message
            messageElement.textContent = `Moi: ${message}`;
            
            // Ajouter l'élément dans le conteneur
            if (MessagerieContainer) {
                MessagerieContainer.appendChild(messageElement);
                // Faire défiler automatiquement vers le bas
                MessagerieContainer.scrollTop = MessagerieContainer.scrollHeight;
            }
            
            messageInput.value = "";  // Réinitialiser le champ de message après envoi
        } else {
            console.log("Le message est vide.");
        }
    });
}
