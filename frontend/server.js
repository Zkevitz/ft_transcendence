/*Fichier JavaScript lancer au demarrage du docker frontend

Celui-ci initialise le Framework fastify, enregistre les clefs et lance
le serveur*/
const fs = require('fs');
const path = require('path');
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'server.crt')),
};
const fastify = require('fastify')({ logger: true, https: httpsOptions });

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'dist'),
  prefix: '/',
});

fastify.register(require('@fastify/http-proxy'), {
  upstream: 'http://backend:3000',
  prefix: '/api', // toutes les requêtes /api seront proxyfiées
  rewritePrefix: '/api',
});

// Pour le fallback SPA (si tu utilises React/Vue/Angular)
fastify.setNotFoundHandler((request, reply) => {
  // Ne renvoyer index.html que pour les routes sans extension (pas d'assets)
  if (!path.extname(request.raw.url)) {
    reply.type('text/html').sendFile('index.html');
  } else {
    reply.code(404).send('Not found from Frontend');
  }
});

//Port notifier dans le 'environnement' ou 3000 par défaut
const PORT = process.env.PORT || 3000;

// Start Fastify on all interfaces for Docker compatibility
fastify.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening at ${address}`);
});
