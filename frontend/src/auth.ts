import { userApi } from "./services/api";

const API_URL = 'http://localhost:3000/api';

export async function authenticateUser() : Promise<{userid : number} | null> 
{
    const response = await fetch(`${API_URL}/auth/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
    if(response.status === 403 || response.status === 401){
        console.log("voici la reponse de l'api")
        console.log(response);
        return Promise.resolve(null);
    }
    else{
      
    }
}