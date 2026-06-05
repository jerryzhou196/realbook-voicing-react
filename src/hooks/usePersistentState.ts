import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

function loadStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Drop-in replacement for useState that mirrors the value to localStorage,
 * restoring it on the next load/reload. Keys are namespaced by the caller.
 */
export function usePersistentState<T>(key: string, fallback: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => loadStored(key, fallback));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore write failures (e.g. private mode quota limits)
    }
  }, [key, value]);

  return [value, setValue];
}
