/**
 * Routes API pour la gestion des utilisateurs
 * 
 * Ce fichier définit les endpoints API pour :
 * - Inscription et connexion des utilisateurs
 * - Gestion des profils utilisateurs
 * - Gestion des relations d'amitié
 * 
 * Ces routes utilisent le service utilisateur pour interagir avec la base de données.
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { 
  createUser, 
  authenticateUser, 
  getUserById, 
  updateUser, 
  deleteUser,
  getUserFriends,
  addFriend,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend
} from '../services/userService';
import { getPlayerStats } from '../services/gameService';

// Types pour les paramètres de requête
interface RegisterRequest {
  Body: {
    username: string;
    email: string;
    password: string;
    avatar_url?: string;
  }
}

interface LoginRequest {
  Body: {
    email: string;
    password: string;
  }
}

interface UserIdParam {
  Params: {
    id: string;
  }
}

interface UpdateUserRequest {
  Params: {
    id: string;
  },
  Body: {
    username?: string;
    email?: string;
    password?: string;
    avatar_url?: string;
  }
}

interface FriendRequest {
  Params: {
    id: string;
    friendId?: string;
  },
  Body: {
    friendId?: number;
  }
}
export async function authenticate(request : FastifyRequest, reply : FastifyReply){
  const token = request.cookies.jwt;
  console.log("voici toutes les cookies ")
  console.log(request.cookies)
  console.log("VOICI MON PREHANDLER")
  console.log(token)
  if(!token)
    return reply.status(401).send({message: "Token manquant dans les cookies"});
  try{
    const payload = await request.jwtVerify();
    request.user = payload
    //console.log(request)
    console.log("jwt cookie encore valide, utilisateur : ", payload)
     //peut etre une bonne idee de refresh le temp d'expiration des coockies
  }
  catch(err){
    console.error("Erreur lors de la vérification du JWT:", err);
    return reply.status(403).send({ message: "Token invalide ou expiré" });
  }
}

/**
 * Enregistre les routes utilisateur dans l'application Fastify
 * @param fastify - Instance Fastify
 */
export default async function userRoutes(fastify: FastifyInstance) {
  // Middleware pour vérifier l'authentification

  fastify.addHook('onRequest', async(request, reply) => {
    return
    const token = request.cookies.jwt;
    console.log("VOICI MON HOOOOK")
    console.log(token)
    if(!token)
      return reply.status(401).send({message: "Token manquant dans les cookies"});
    try{
      const payload = await request.jwtVerify();
      request.user = payload
      //console.log(request)
      console.log("jwt cookie encore valide, utilisateur : ", payload)
       //peut etre une bonne idee de refresh le temp d'expiration des coockies
    }
    catch(err){
      console.error("Erreur lors de la vérification du JWT:", err);
      return reply.status(403).send({ message: "Token invalide ou expiré" });
    }
  });

  // Route d'inscription
  fastify.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { username, email, password, avatar_url } = request.body as RegisterRequest['Body'];
      
      // Validation des données
      if (!username || !email || !password) {
        return reply.code(400).send({ error: 'Tous les champs obligatoires doivent être remplis' });
      }
      
      // Création de l'utilisateur
      const userId = await createUser({ username, email, password, avatar_url });
      
      // Récupération de l'utilisateur créé
      const user = await getUserById(userId);
      
      // Génération du token JWT
      const token = fastify.jwt.sign({ id: userId }, { expiresIn: '1d' });
      
      reply.code(201).send({ user, token });
    } catch (err: any) {
      // Gestion des erreurs de contrainte unique (email ou username déjà utilisés)
      if (err.message.includes('UNIQUE constraint failed')) {
        if (err.message.includes('email')) {
          return reply.code(400).send({ error: 'Cet email est déjà utilisé' });
        }
        if (err.message.includes('username')) {
          return reply.code(400).send({ error: 'Ce nom d\'utilisateur est déjà utilisé' });
        }
      }
      
      reply.code(500).send({ error: 'Erreur lors de l\'inscription' });
    }
  });

  // route pour savoir si un utilisateur est connecter avec des token valide(expiration, etc)
  fastify.get('/auth/status', async(request: FastifyRequest, reply: FastifyReply) => {
      console.log("Tous les cookies reçus:", request.cookies);
      const token = request.cookies.jwt;
      if(!token)
        return reply.status(401).send({message: "Token manquant dans les cookies"});
      console.log(token);
      try{
        await request.jwtVerify();
        return reply.status(200).send({message: "Token toujours valide"})
      }
      catch(err)
      {
        console.error("Erreur lors de la vérification du JWT:", err);
        return reply.status(403).send({ message: "Token invalide ou expiré" });
      }
  })
  fastify.post('/logout', async (request: FastifyRequest, reply: FastifyReply) => { 
    reply.clearCookie('jwt', {
      httpOnly: true,
      secure: false, //process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',});
      return reply.send({ message: 'Déconnexion réussie, cookie supprimé.' });
  });


  // Route de connexion
  fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email, password } = request.body as LoginRequest['Body'];
      
      // Validation des données
      if (!email || !password) {
        return reply.code(400).send({ error: 'Email et mot de passe requis' });
      }
      
      // Authentification de l'utilisateur
      const user = await authenticateUser(email, password);
      
      if (!user) {
        return reply.code(401).send({ error: 'Email ou mot de passe incorrect' });
      }
      
      // Génération du token JWT
      const token = fastify.jwt.sign({ id: user.id }, { expiresIn: '1d' });
      reply.setCookie('jwt', token, {
        httpOnly: true,
        secure : false,//process.env.NODE_ENV === 'production',
        sameSite : 'strict',
        maxAge: 360000,
        path: '/'
      });
      console.log("JE SUIS LAAAAA")
      reply.send({ user, token });
    } catch (err) {
      reply.code(500).send({ error: 'Erreur lors de la connexion' });
    }
  });

  // Route pour récupérer le profil de l'utilisateur connecté
  fastify.get('/me', { onRequest: [authenticate]}, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as any).id;
      
      // Récupération de l'utilisateur
      const user = await getUserById(userId);
      
      if (!user) {
        return reply.code(404).send({ error: 'Utilisateur non trouvé' });
      }
      
      // Récupération des statistiques du joueur
      const stats = await getPlayerStats(userId);
      
      reply.send({ user, stats });
    } catch (err) {
      reply.code(500).send({ error: 'Erreur lors de la récupération du profil' });
    }
  });

  // Route pour récupérer un utilisateur par son ID
  fastify.get('/users/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = parseInt((request.params as UserIdParam['Params']).id);
      
      // Récupération de l'utilisateur
      const user = await getUserById(userId);
      
      if (!user) {
        return reply.code(404).send({ error: 'Utilisateur non trouvé' });
      }
      
      // Récupération des statistiques du joueur
      const stats = await getPlayerStats(userId);
      
      reply.send({ user, stats });
    } catch (err) {
      reply.code(500).send({ error: 'Erreur lors de la récupération de l\'utilisateur' });
    }
  });

  // Route pour mettre à jour un utilisateur
  fastify.put('/users/:id', { onRequest: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = parseInt((request.params as UpdateUserRequest['Params']).id);
      const authUserId = (request.user as any).id;
      
      // Vérification que l'utilisateur modifie son propre profil
      if (userId !== authUserId) {
        return reply.code(403).send({ error: 'Non autorisé à modifier ce profil' });
      }
      
      const userData = request.body as UpdateUserRequest['Body'];
      
      // Mise à jour de l'utilisateur
      const success = await updateUser(userId, userData);
      
      if (!success) {
        return reply.code(404).send({ error: 'Utilisateur non trouvé' });
      }
      
      // Récupération de l'utilisateur mis à jour
      const user = await getUserById(userId);
      
      reply.send({ user });
    } catch (err: any) {
      // Gestion des erreurs de contrainte unique (email ou username déjà utilisés)
      if (err.message.includes('UNIQUE constraint failed')) {
        if (err.message.includes('email')) {
          return reply.code(400).send({ error: 'Cet email est déjà utilisé' });
        }
        if (err.message.includes('username')) {
          return reply.code(400).send({ error: 'Ce nom d\'utilisateur est déjà utilisé' });
        }
      }
      
      reply.code(500).send({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
    }
  });

  // Route pour supprimer un utilisateur
  fastify.delete('/users/:id', { onRequest: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = parseInt((request.params as UserIdParam['Params']).id);
      const authUserId = (request.user as any).id;
      
      // Vérification que l'utilisateur supprime son propre compte
      if (userId !== authUserId) {
        return reply.code(403).send({ error: 'Non autorisé à supprimer ce compte' });
      }
      
      // Suppression de l'utilisateur
      const success = await deleteUser(userId);
      
      if (!success) {
        return reply.code(404).send({ error: 'Utilisateur non trouvé' });
      }
      
      reply.send({ success: true, message: 'Utilisateur supprimé avec succès' });
    } catch (err) {
      reply.code(500).send({ error: 'Erreur lors de la suppression de l\'utilisateur' });
    }
  });

  // Route pour récupérer les amis d'un utilisateur
  fastify.get('/users/:id/friends', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = parseInt((request.params as UserIdParam['Params']).id);
      
      // Récupération des amis
      const friends = await getUserFriends(userId);
      
      reply.send({ friends });
    } catch (err) {
      reply.code(500).send({ error: 'Erreur lors de la récupération des amis' });
    }
  });

  // Route pour ajouter un ami
  fastify.post('/users/:id/friends', { onRequest: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = parseInt((request.params as FriendRequest['Params']).id);
      const authUserId = (request.user as any).id;
      const friendId = (request.body as FriendRequest['Body']).friendId;
      
      // Vérification que l'utilisateur ajoute un ami à son propre compte
      if (userId !== authUserId) {
        return reply.code(403).send({ error: 'Non autorisé à ajouter un ami à ce compte' });
      }
      
      // Vérification que l'utilisateur n'essaie pas de s'ajouter lui-même
      if (userId === friendId) {
        return reply.code(400).send({ error: 'Vous ne pouvez pas vous ajouter vous-même comme ami' });
      }
      
      // Ajout de l'ami
      const success = await addFriend(userId, friendId);
      
      if (!success) {
        return reply.code(400).send({ error: 'Erreur lors de l\'ajout de l\'ami' });
      }
      
      reply.send({ success: true, message: 'Demande d\'ami envoyée avec succès' });
    } catch (err) {
      reply.code(500).send({ error: 'Erreur lors de l\'ajout de l\'ami' });
    }
  });

  // Route pour accepter une demande d'ami
  fastify.put('/users/:id/friends/accept', { onRequest: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = parseInt((request.params as FriendRequest['Params']).id);
      const authUserId = (request.user as any).id;
      const friendId = (request.body as FriendRequest['Body']).friendId;
      
      // Vérification que l'utilisateur accepte une demande d'ami pour son propre compte
      if (userId !== authUserId) {
        return reply.code(403).send({ error: 'Non autorisé à accepter une demande d\'ami pour ce compte' });
      }
      
      // Acceptation de la demande d'ami
      const success = await acceptFriendRequest(userId, friendId);
      
      if (!success) {
        return reply.code(400).send({ error: 'Erreur lors de l\'acceptation de la demande d\'ami' });
      }
      
      reply.send({ success: true, message: 'Demande d\'ami acceptée avec succès' });
    } catch (err) {
      reply.code(500).send({ error: 'Erreur lors de l\'acceptation de la demande d\'ami' });
    }
  });

  // Route pour rejeter une demande d'ami
  fastify.put('/users/:id/friends/reject', { onRequest: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = parseInt((request.params as FriendRequest['Params']).id);
      const authUserId = (request.user as any).id;
      const friendId = (request.body as FriendRequest['Body']).friendId;
      
      // Vérification que l'utilisateur rejette une demande d'ami pour son propre compte
      if (userId !== authUserId) {
        return reply.code(403).send({ error: 'Non autorisé à rejeter une demande d\'ami pour ce compte' });
      }
      
      // Rejet de la demande d'ami
      const success = await rejectFriendRequest(userId, friendId);
      
      if (!success) {
        return reply.code(400).send({ error: 'Erreur lors du rejet de la demande d\'ami' });
      }
      
      reply.send({ success: true, message: 'Demande d\'ami rejetée avec succès' });
    } catch (err) {
      reply.code(500).send({ error: 'Erreur lors du rejet de la demande d\'ami' });
    }
  });

  // Route pour supprimer un ami
  fastify.delete('/users/:id/friends/:friendId', { onRequest: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = parseInt((request.params as FriendRequest['Params']).id);
      const friendId = parseInt((request.params as FriendRequest['Params']).friendId as string);
      const authUserId = (request.user as any).id;
      
      // Vérification que l'utilisateur supprime un ami de son propre compte
      if (userId !== authUserId) {
        return reply.code(403).send({ error: 'Non autorisé à supprimer un ami de ce compte' });
      }
      
      // Suppression de l'ami
      const success = await removeFriend(userId, friendId);
      
      if (!success) {
        return reply.code(400).send({ error: 'Erreur lors de la suppression de l\'ami' });
      }
      
      reply.send({ success: true, message: 'Ami supprimé avec succès' });
    } catch (err) {
      reply.code(500).send({ error: 'Erreur lors de la suppression de l\'ami' });
    }
  });
}
