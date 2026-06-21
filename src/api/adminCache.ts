/**
 * adminCache.ts
 * Simple sessionStorage-based cache for admin pages.
 * Data is fetched once per session and reused on return visits.
 * Cache is cleared automatically on logout (see api.ts).
 */

const TTL_MS = 15 * 60 * 1000; // 5 minutes

export function readCache<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > TTL_MS) {
      sessionStorage.removeItem(key);
      return null;
    }
    return data as T;
  } catch {
    return null;
  }
}

export function writeCache(key: string, data: unknown): void {
  try {
    sessionStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch { /* storage full – skip caching */ }
}

export function clearCache(key: string): void {
  sessionStorage.removeItem(key);
}

export function clearAllAdminCache(): void {
  const keys = ['adminDashboardCache', 'adminUsersCache', 'adminRolesCache'];
  keys.forEach((k) => sessionStorage.removeItem(k));
}
