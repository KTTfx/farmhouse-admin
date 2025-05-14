
// Minimal next-themes implementation for Sonner

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return <>{children}</>;
};

export const useTheme = () => {
  return { theme: "light", setTheme: (theme: string) => {} };
};
