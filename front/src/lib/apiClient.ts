import { API_URL } from '../constants';

async function refreshAccesstoken(): Promise<string | null> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return null;

  const res = await fetch(`${API_URL}/api/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  localStorage.setItem('accessToken', data.accessToken.token);
  localStorage.setItem('refreshToken', data.refreshToken.token);
  return data.accessToken.token;
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const accessToken = localStorage.getItem('accessToken');

  // Ne pas forcer Content-Type pour les FormData (le navigateur gère le boundary multipart)
  const isFormData = options.body instanceof FormData;

  const doFetch = (token: string | null) =>
    fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  let res = await doFetch(accessToken);

  // Token expiré → on tente un refresh puis on rejoue la requête une seule fois
  if (res.status === 401) {
    const newToken = await refreshAccesstoken();

    if (!newToken) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('User');
      window.location.href = '/login';
      throw new Error('Session expired');
    }

    res = await doFetch(newToken);
  }

  return res;
}
