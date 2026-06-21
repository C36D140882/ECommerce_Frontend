export const API_URL: string =
  import.meta.env.VITE_API_BASE ?? 'http://localhost:8000/api';

// ── Token helpers ────────────────────────────────────────────────────────────

function getTokens() {
  const raw = localStorage.getItem('userTokens');
  return raw ? JSON.parse(raw) : null;
}

async function refreshAccessToken(): Promise<string | null> {
  const tokens = getTokens();
  if (!tokens?.refresh) return null;

  try {
    const res = await fetch(`${API_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: tokens.refresh }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    localStorage.setItem('userTokens', JSON.stringify({ ...tokens, access: data.access }));
    return data.access;
  } catch {
    return null;
  }
}

// ── Authenticated fetch ──────────────────────────────────────────────────────

/**
 * FIX: URL scheme is /api/auth/users/, /api/auth/roles/, /api/auth/permissions/
 * (all registered under apps.authentication.urls which is mounted at api/auth/).
 * Pass paths WITHOUT the /api prefix — this function prepends API_URL.
 *
 * Examples:
 *   fetchWithAuth('/auth/users/')
 *   fetchWithAuth('/auth/roles/')
 *   fetchWithAuth('/auth/permissions/')
 */
export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  let tokens = getTokens();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (tokens?.access) {
    headers.set('Authorization', `Bearer ${tokens.access}`);
  }

  let response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

  // Auto-refresh on 401
  if (response.status === 401 && tokens?.refresh) {
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      headers.set('Authorization', `Bearer ${newAccess}`);
      response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    } else {
      // Refresh failed — clear session and redirect
      localStorage.removeItem('userTokens');
      localStorage.removeItem('userData');
      localStorage.removeItem('userSession');
      window.location.href = '/login';
    }
  }

  return response;
}

// ── User data helpers ────────────────────────────────────────────────────────

export function getUserData(): any {
  const raw = localStorage.getItem('userData');
  return raw ? JSON.parse(raw) : null;
}

export function hasPermission(permission: string): boolean {
  const user = getUserData();
  if (!user) return false;
  if (user.role === 'Admin') return true;
  return Array.isArray(user.permissions) && user.permissions.includes(permission);
}

export function isAdmin(): boolean {
  return getUserData()?.role === 'Admin';
}

export function logout() {
  localStorage.removeItem('userTokens');
  localStorage.removeItem('userData');
  localStorage.removeItem('userSession');
  // Clear all admin page caches so fresh data is loaded on next login
  import('./adminCache').then(({ clearAllAdminCache }) => clearAllAdminCache());
}