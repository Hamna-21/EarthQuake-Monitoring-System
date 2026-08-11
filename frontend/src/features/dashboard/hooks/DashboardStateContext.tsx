import { createContext, useCallback, useContext, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';

type Cache = Record<string, unknown>;
type Store = { cache: Cache; save: (key: string, value: unknown) => void };
const DashboardStateContext = createContext<Store | null>(null);

export function DashboardStateProvider({ children }: { children: ReactNode }) {
  const [cache, setCache] = useState<Cache>({});
  const save = useCallback((key: string, value: unknown) => setCache((current) => ({ ...current, [key]: value })), []);
  return <DashboardStateContext.Provider value={{ cache, save }}>{children}</DashboardStateContext.Provider>;
}

export function useDashboardPageState<T>(key: string, initial: T, persist = false): [T, Dispatch<SetStateAction<T>>] {
  const store = useContext(DashboardStateContext);
  if (!store) throw new Error('DashboardStateProvider is required.');
  const initialValue = useRef<T | null>(null);
  if (initialValue.current === null) initialValue.current = read<T>(key, store.cache[key], initial, persist);
  const [value, setValue] = useState<T>(initialValue.current);
  const update: Dispatch<SetStateAction<T>> = useCallback((next) => setValue((current) => {
    const resolved = typeof next === 'function' ? (next as (value: T) => T)(current) : next;
    store.save(key, resolved); write(key, resolved, persist); return resolved;
  }), [key, persist, store]);
  return [value, update];
}

function read<T>(key: string, cached: unknown, initial: T, persist: boolean) {
  if (cached !== undefined) return cached as T;
  if (!persist) return initial;
  try { return JSON.parse(sessionStorage.getItem(`geopulse:${key}`) || 'null') ?? initial; } catch { return initial; }
}

function write(key: string, value: unknown, persist: boolean) {
  if (!persist) return;
  try { sessionStorage.setItem(`geopulse:${key}`, JSON.stringify(value)); } catch { /* storage is optional */ }
}
