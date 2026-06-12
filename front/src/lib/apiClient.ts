import { API_URL } from '../constants';

async function refreshAccesstoken(): Promise<string | null> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return null;

  const res = await fetch(`${API_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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

  // Effectue la requête avec le token donné dans le header Authorization
  const doFetch = (token: string | null) =>
    fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  // 1ere tentative avec le token actuel
  let res = await doFetch(accessToken);

  // Si l'accessToken est expiré, on essaie de le renouveler avec le refreshToken
  if (res.status === 401) {
    const newToken = await refreshAccesstoken();

    if (!newToken) {
      // Le refreshToken est aussi invalide/expiré -> on déconnecte l'utilisateur
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('User');
      window.location.href = '/login';
      throw new Error('Session expired');
    }

    // On rejoue la requête une seule fois avec le nouveau token
    res = await doFetch(newToken);
  }

  return res;
}
