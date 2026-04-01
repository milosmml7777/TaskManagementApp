import { useEffect, useState } from 'react';
import { getItem, setItem } from '../utils/storage';

export function usePersistentState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => getItem<T>(key) ?? initialValue);

  useEffect(() => {
    setItem(key, state);
  }, [key, state]);

  return [state, setState] as const;
}
