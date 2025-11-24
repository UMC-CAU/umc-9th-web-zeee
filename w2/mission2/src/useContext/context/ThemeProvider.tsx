import { createContext, type PropsWithChildren, useState } from "react";

enum THEME {
  LIGHT = "LIGHT",
  DARK = "DARK",
}

type TTHEME = THEME.LIGHT | THEME.DARK;

interface IThemeContext {
  theme: TTHEME;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<TTHEME>(THEME.LIGHT);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
