import { useEffect, useRef, useState } from 'react';
import { getItem, setItem } from '../utils/storage';

export function usePersistentState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasHydrated = useRef(false);

  useEffect(() => {
    let active = true;

    getItem<T>(key)
      .then((storedValue) => {
        if (!active) {
          return;
        }

        if (storedValue !== null) {
          setState(storedValue);
        }

        hasHydrated.current = true;
        setIsLoaded(true);
      })
      .catch(() => {
        if (!active) {
          return;
        }

        hasHydrated.current = true;
        setIsLoaded(true);
      });

    return () => {
      active = false;
    };
  }, [key]);

  useEffect(() => {
    if (!hasHydrated.current) {
      return;
    }

    void setItem(key, state);
  }, [key, state]);

  return [state, setState, isLoaded] as const;
}
