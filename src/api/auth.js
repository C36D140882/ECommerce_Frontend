const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000/api';

export async function fetchMe() {
  const response = await fetch(`${API_BASE}/auth/me/`, {
    credentials: 'include',
  });

  const data = await response.json();
  return { response, data };
}

export async function loginAdmin(username, password) {
  const response = await fetch(`${API_BASE}/auth/login/`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  return { response, data };
}

export async function logoutAdmin() {
  const response = await fetch(`${API_BASE}/auth/logout/`, {
    method: 'POST',
    credentials: 'include',
  });

  const data = await response.json();
  return { response, data };
}
