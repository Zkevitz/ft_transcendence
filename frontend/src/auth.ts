import { userApi } from "./services/api";

const API_URL = 'http://localhost:3000/api';

export async function authenticateUser() : Promise<{userid : number}> | null 
{
    const response = await fetch(`${API_URL}/auth/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
    if(response)
        console.log(response);
    return null;
}