const isBrowser = typeof window !== 'undefined';

export function getItem<T>(key: string): T | null {
  //ref error on window. if browser is null
  if (!isBrowser) {
    return null;
  }

  const value = window.localStorage.getItem(key);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}
