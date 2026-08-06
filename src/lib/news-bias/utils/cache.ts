/**
 * Simple TTL cache for provider responses.
 * Survives across hook remounts in the same JS runtime.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

export function cacheGet<T>(key: string): T | null {
  const hit = store.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expiresAt) {
    store.delete(key);
    return null;
  }
  return hit.value as T;
}

/** Returns stale value even if expired — used for offline / API failure fallback. */
export function cacheGetStale<T>(key: string): T | null {
  const hit = store.get(key);
  return hit ? (hit.value as T) : null;
}

export function cacheSet<T>(key: string, value: T, ttlMs: number): void {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export function cacheClear(prefix?: string): void {
  if (!prefix) {
    store.clear();
    return;
  }
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}

/** Test helper. */
export function cacheSize(): number {
  return store.size;
}
