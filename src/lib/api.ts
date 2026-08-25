const API_BASE = process.env.API_URL || 'https://thriftza-back-8vlw.onrender.com';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || data.message || `API error: ${response.status}`);
  }

  return data;
}

export async function loginUser(credentials: Record<string, any>) {
  const data = await fetchApi('/api/auth/login/', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  if (data.access) localStorage.setItem('access_token', data.access);
  if (data.refresh) localStorage.setItem('refresh_token', data.refresh);

  return data;
}

export async function registerUser(payload: Record<string, any>) {
  const data = await fetchApi('/api/auth/register/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (data.access) localStorage.setItem('access_token', data.access);
  if (data.refresh) localStorage.setItem('refresh_token', data.refresh);

  return data;
}