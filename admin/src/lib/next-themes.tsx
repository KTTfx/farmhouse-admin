// Minimal next-themes implementation for Sonner

import { useState } from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return <>{children}</>;
};

export const useTheme = () => {
  const [theme, setTheme] = useState<string>('light');
  return { theme, setTheme };
};
