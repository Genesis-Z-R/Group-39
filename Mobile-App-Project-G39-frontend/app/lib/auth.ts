import { config } from '../../src/config/config';

const BASE_URL = config.api.baseUrl + "/users";

export const createUser = async(email: string, password: string, username: string, token: string) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({email, password, username})
  });
  return response.json();
}