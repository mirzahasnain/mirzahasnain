/**
 * Minimal external store (useSyncExternalStore-friendly).
 * Separates domains — do not dump unrelated state into one blob.
 */
export type Listener = () => void;

export interface StoreApi<T> {
  getState: () => T;
  setState: (partial: Partial<T> | ((prev: T) => Partial<T>)) => void;
  subscribe: (listener: Listener) => () => void;
  replace: (next: T) => void;
}

export function createStore<T extends object>(initial: T): StoreApi<T> {
  let state = initial;
  const listeners = new Set<Listener>();

  const getState = () => state;

  const setState: StoreApi<T>["setState"] = (partial) => {
    const patch = typeof partial === "function" ? partial(state) : partial;
    state = { ...state, ...patch };
    listeners.forEach((l) => l());
  };

  const replace = (next: T) => {
    state = next;
    listeners.forEach((l) => l());
  };

  const subscribe = (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return { getState, setState, subscribe, replace };
}
