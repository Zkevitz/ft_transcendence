/**
 * Moteur de jeu Pong
 *
 * Ce module implémente la logique du jeu Pong, y compris:
 * - La gestion des raquettes et de la balle
 * - La détection des collisions
 * - Le calcul des scores
 * - La boucle de jeu principale
 *
 * Le jeu est conçu pour être jouable à la fois en local et en ligne
 * via des connexions WebSocket pour le multijoueur.
 */
// État global du jeu
let gameState = null;
let animationFrameId = null;
/**
 * Initialise le moteur de jeu
 */
export function initializeGameEngine() {
    console.log('Initialisation du moteur de jeu Pong');
}
/**
 * Crée un nouvel état de jeu avec les valeurs par défaut
 * @param width - Largeur du terrain de jeu
 * @param height - Hauteur du terrain de jeu
 * @returns Le nouvel état de jeu
 */
export function createGameState(width, height) {
    const paddleHeight = height / 6;
    const paddleWidth = width / 50;
    const ballSize = width / 50;
    return {
        ball: {
            x: width / 2 - ballSize / 2,
            y: height / 2 - ballSize / 2,
            width: ballSize,
            height: ballSize,
            speed: 5,
            dx: Math.random() > 0.5 ? 1 : -1, // Direction aléatoire au départ
            dy: Math.random() > 0.5 ? 1 : -1 // Direction aléatoire au départ
        },
        leftPaddle: {
            x: paddleWidth,
            y: height / 2 - paddleHeight / 2,
            width: paddleWidth,
            height: paddleHeight,
            speed: 8,
            score: 0
        },
        rightPaddle: {
            x: width - paddleWidth * 2,
            y: height / 2 - paddleHeight / 2,
            width: paddleWidth,
            height: paddleHeight,
            speed: 8,
            score: 0
        },
        gameWidth: width,
        gameHeight: height,
        isRunning: false,
        isPaused: false
    };
}
/**
 * Démarre une nouvelle partie
 * @param canvasId - ID de l'élément canvas pour le rendu du jeu
 */
export function startGame(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`Canvas avec l'ID ${canvasId} non trouvé`);
        return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Impossible d\'obtenir le contexte 2D du canvas');
        return;
    }
    // Création de l'état initial du jeu
    gameState = createGameState(canvas.width, canvas.height);
    gameState.isRunning = true;
    // Configuration des contrôles clavier
    setupKeyboardControls();
    // Démarrage de la boucle de jeu
    gameLoop(ctx);
    console.log('Partie démarrée');
}
/**
 * Configure les contrôles clavier pour les deux joueurs
 */
function setupKeyboardControls() {
    if (!gameState)
        return;
    document.addEventListener('keydown', (event) => {
        if (!gameState || gameState.isPaused)
            return;
        // Contrôles du joueur 1 (gauche) - touches W et S
        if (event.key === 'w' || event.key === 'W') {
            moveLeftPaddleUp();
        }
        else if (event.key === 's' || event.key === 'S') {
            moveLeftPaddleDown();
        }
        // Contrôles du joueur 2 (droite) - touches flèche haut et bas
        if (event.key === 'ArrowUp') {
            moveRightPaddleUp();
        }
        else if (event.key === 'ArrowDown') {
            moveRightPaddleDown();
        }
        // Pause avec la touche Espace
        if (event.key === ' ') {
            togglePause();
        }
    });
}
/**
 * Déplace la raquette gauche vers le haut
 */
function moveLeftPaddleUp() {
    if (!gameState)
        return;
    gameState.leftPaddle.y -= gameState.leftPaddle.speed;
    if (gameState.leftPaddle.y < 0) {
        gameState.leftPaddle.y = 0;
    }
}
/**
 * Déplace la raquette gauche vers le bas
 */
function moveLeftPaddleDown() {
    if (!gameState)
        return;
    gameState.leftPaddle.y += gameState.leftPaddle.speed;
    if (gameState.leftPaddle.y + gameState.leftPaddle.height > gameState.gameHeight) {
        gameState.leftPaddle.y = gameState.gameHeight - gameState.leftPaddle.height;
    }
}
/**
 * Déplace la raquette droite vers le haut
 */
function moveRightPaddleUp() {
    if (!gameState)
        return;
    gameState.rightPaddle.y -= gameState.rightPaddle.speed;
    if (gameState.rightPaddle.y < 0) {
        gameState.rightPaddle.y = 0;
    }
}
/**
 * Déplace la raquette droite vers le bas
 */
function moveRightPaddleDown() {
    if (!gameState)
        return;
    gameState.rightPaddle.y += gameState.rightPaddle.speed;
    if (gameState.rightPaddle.y + gameState.rightPaddle.height > gameState.gameHeight) {
        gameState.rightPaddle.y = gameState.gameHeight - gameState.rightPaddle.height;
    }
}
/**
 * Met en pause ou reprend la partie
 */
function togglePause() {
    if (!gameState)
        return;
    gameState.isPaused = !gameState.isPaused;
    console.log(gameState.isPaused ? 'Jeu en pause' : 'Jeu repris');
}
/**
 * Met à jour l'état du jeu (positions, collisions, scores)
 */
function updateGameState() {
    if (!gameState || !gameState.isRunning || gameState.isPaused)
        return;
    // Mise à jour de la position de la balle
    gameState.ball.x += gameState.ball.dx * gameState.ball.speed;
    gameState.ball.y += gameState.ball.dy * gameState.ball.speed;
    // Collision avec les bords haut et bas
    if (gameState.ball.y <= 0 || gameState.ball.y + gameState.ball.height >= gameState.gameHeight) {
        gameState.ball.dy *= -1; // Inversion de la direction verticale
    }
    // Collision avec les raquettes
    if (checkCollision(gameState.ball, gameState.leftPaddle) ||
        checkCollision(gameState.ball, gameState.rightPaddle)) {
        gameState.ball.dx *= -1; // Inversion de la direction horizontale
        // Augmentation légère de la vitesse à chaque rebond
        gameState.ball.speed *= 1.05;
    }
    // Vérification des points marqués
    if (gameState.ball.x <= 0) {
        // Point pour le joueur de droite
        gameState.rightPaddle.score++;
        resetBall();
    }
    else if (gameState.ball.x + gameState.ball.width >= gameState.gameWidth) {
        // Point pour le joueur de gauche
        gameState.leftPaddle.score++;
        resetBall();
    }
}
/**
 * Vérifie s'il y a collision entre deux objets
 * @param obj1 - Premier objet
 * @param obj2 - Deuxième objet
 * @returns Vrai s'il y a collision, faux sinon
 */
function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y;
}
/**
 * Réinitialise la position de la balle après un point marqué
 */
function resetBall() {
    if (!gameState)
        return;
    gameState.ball.x = gameState.gameWidth / 2 - gameState.ball.width / 2;
    gameState.ball.y = gameState.gameHeight / 2 - gameState.ball.height / 2;
    gameState.ball.speed = 5; // Réinitialisation de la vitesse
    // Direction aléatoire pour le prochain échange
    gameState.ball.dx = Math.random() > 0.5 ? 1 : -1;
    gameState.ball.dy = Math.random() > 0.5 ? 1 : -1;
}
/**
 * Dessine l'état actuel du jeu sur le canvas
 * @param ctx - Contexte 2D du canvas
 */
function drawGame(ctx) {
    if (!gameState)
        return;
    // Effacement du canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, gameState.gameWidth, gameState.gameHeight);
    // Dessin de la ligne centrale
    ctx.strokeStyle = 'white';
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(gameState.gameWidth / 2, 0);
    ctx.lineTo(gameState.gameWidth / 2, gameState.gameHeight);
    ctx.stroke();
    ctx.setLineDash([]);
    // Dessin des raquettes
    ctx.fillStyle = 'white';
    ctx.fillRect(gameState.leftPaddle.x, gameState.leftPaddle.y, gameState.leftPaddle.width, gameState.leftPaddle.height);
    ctx.fillRect(gameState.rightPaddle.x, gameState.rightPaddle.y, gameState.rightPaddle.width, gameState.rightPaddle.height);
    // Dessin de la balle
    ctx.fillRect(gameState.ball.x, gameState.ball.y, gameState.ball.width, gameState.ball.height);
    // Affichage des scores
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(gameState.leftPaddle.score.toString(), gameState.gameWidth / 4, 50);
    ctx.fillText(gameState.rightPaddle.score.toString(), gameState.gameWidth * 3 / 4, 50);
    // Affichage du message de pause si nécessaire
    if (gameState.isPaused) {
        ctx.font = '24px Arial';
        ctx.fillText('PAUSE', gameState.gameWidth / 2, gameState.gameHeight / 2);
    }
}
/**
 * Boucle principale du jeu
 * @param ctx - Contexte 2D du canvas
 */
function gameLoop(ctx) {
    // Mise à jour de l'état du jeu
    updateGameState();
    // Dessin du jeu
    drawGame(ctx);
    // Planification de la prochaine frame
    animationFrameId = requestAnimationFrame(() => gameLoop(ctx));
}
/**
 * Arrête la partie en cours
 */
export function stopGame() {
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    gameState = null;
    console.log('Partie arrêtée');
}
//# sourceMappingURL=engine.js.map