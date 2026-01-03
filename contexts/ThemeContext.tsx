import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'cosmic' | 'aurora' | 'inferno' | 'cyberpunk' | 'midnight' | 'luxury';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('aivision_theme') as Theme) || 'cosmic';
  });

  useEffect(() => {
    const root = document.documentElement;
    // Clean up all possible theme classes
    root.classList.remove(
        'theme-cosmic', 
        'theme-aurora', 
        'theme-inferno', 
        'theme-cyberpunk', 
        'theme-midnight', 
        'theme-luxury'
    );
    root.classList.add(`theme-${theme}`);
    localStorage.setItem('aivision_theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};