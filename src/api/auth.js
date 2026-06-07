const API_BASE = process.env.REACT_APP_API_BASE;

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
