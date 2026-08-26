const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || 'https://thriftza-back-8vlw.onrender.com'
).replace(/\/$/, '');

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const response = await fetch(`${API_BASE}${formattedEndpoint}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.detail || data.message || Object.values(data).flat().join(' ') || 'An error occurred';
    throw new Error(errorMsg);
  }
  return data;
}

export async function registerUser(payload: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}) {
  const data = await fetchApi('/api/auth/register/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (typeof window !== 'undefined' && data.access) {
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
  }
  return data;
}

export async function loginUser(credentials: { email: string; password: string }) {
  // Django JWT TokenObtainPairView expects 'email' or 'username' depending on USERNAME_FIELD
  const data = await fetchApi('/api/auth/login/', {
    method: 'POST',
    body: JSON.stringify({
      username: credentials.email, // Passing email as username for Django
      password: credentials.password,
    }),
  });

  if (typeof window !== 'undefined' && data.access) {
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
  }
  return data;
}

export async function getCurrentUser() {
  return await fetchApi('/api/auth/me/', {
    method: 'GET',
  });
}