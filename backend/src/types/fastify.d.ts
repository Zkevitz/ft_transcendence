/**
 * Types personnalisés pour Fastify
 * 
 * Ce fichier définit les types personnalisés pour Fastify, notamment pour
 * l'authentification JWT et les utilisateurs.
 */

import '@fastify/jwt';

// Extension du type User pour JWT
declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: number }; // Payload du token JWT
    user: {
      id: number;
    };
  }
}

// Extension du type Request pour inclure l'utilisateur authentifié
declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: number;
    };
    jwtVerify(): Promise<any>;
    body: any;
    params: any;
    query: any;
  }
  
  interface FastifyReply {
    code(statusCode: number): FastifyReply;
    send(payload?: any): FastifyReply;
  }
  
  interface FastifyInstance {
    jwt: {
      sign(payload: any, options?: any): string;
      verify(token: string, options?: any): any;
    };
    authenticate: any;
    get(path: string, handler: any): FastifyInstance;
    get(path: string, options: any, handler: any): FastifyInstance;
    post(path: string, handler: any): FastifyInstance;
    post(path: string, options: any, handler: any): FastifyInstance;
    put(path: string, handler: any): FastifyInstance;
    put(path: string, options: any, handler: any): FastifyInstance;
    delete(path: string, handler: any): FastifyInstance;
    delete(path: string, options: any, handler: any): FastifyInstance;
  }
}
