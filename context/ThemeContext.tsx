import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 
  | 'light' | 'paper' | 'romantic' | 'night-blue' 
  | 'dark-forest' | 'matrix' | 'rose-pine' | 'github-dark';

const validThemes: Theme[] = [
  'light', 'paper', 'romantic', 'night-blue', 'dark-forest', 
  'matrix', 'rose-pine', 'github-dark'
];

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedTheme = window.localStorage.getItem('theme');
    if (storedTheme && validThemes.includes(storedTheme as Theme)) {
      return storedTheme as Theme;
    }
  }
  return 'light';
};


export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};