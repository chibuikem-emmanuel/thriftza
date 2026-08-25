import { fetchApi } from './api';

export async function loginUser(credentials: Record<string, any>) {
  const res = await fetchApi('/api/auth/login/', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || data.message || 'Login failed');
  }

  if (data.access) {
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
  }

  return data;
}

export async function registerUser(userData: Record<string, any>) {
  const res = await fetchApi('/api/auth/register/', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

  const data = await res.json();

  if (!res.ok) {
    const firstKey = Object.keys(data)[0];
    const errMsg = Array.isArray(data[firstKey])
      ? `${firstKey}: ${data[firstKey][0]}`
      : data.message || 'Registration failed';
    throw new Error(errMsg);
  }

  if (data.access) {
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
  }

  return data;
}

export function logoutUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-change'));
  }
}