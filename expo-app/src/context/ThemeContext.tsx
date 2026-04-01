import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from 'react';
import { usePersistentState } from '../hooks/usePersistentState';
import { STORAGE_KEYS, THEME_COLORS } from '../utils/constants';
import type { Theme, ThemeColors } from '../utils/types';

type ThemeContextValue = {
  theme: Theme;
  colors: ThemeColors;
  isLoaded: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme, isLoaded] = usePersistentState<Theme>(STORAGE_KEYS.theme, 'light');

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      colors: THEME_COLORS[theme],
      isLoaded,
      toggleTheme: () => {
        setTheme((current) => (current === 'light' ? 'dark' : 'light'));
      },
    }),
    [isLoaded, setTheme, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
