// src/lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://thriftza-back-8vlw.onrender.com';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
}

// Alias export to prevent build errors where apiFetch is imported
export const apiFetch = fetchApi;