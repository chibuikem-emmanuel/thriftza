import { apiFetch } from './api';

export async function registerUser(userData: {
  username: string;
  email: string;
  phone_number: string;
  password: string;
}) {
  return await apiFetch('/auth/register/', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export async function loginUser(credentials: { username: string; password: string }) {
  const data = await apiFetch('/auth/login/', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  if (data.access) {
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  return data;
}