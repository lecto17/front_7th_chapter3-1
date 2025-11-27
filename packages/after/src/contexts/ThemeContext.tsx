import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark" | "christmas" | "halloween";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_CYCLE: Theme[] = ["light", "dark", "christmas", "halloween"];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored && THEME_CYCLE.includes(stored)) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;

    // Remove all theme classes
    root.classList.remove("dark", "theme-christmas", "theme-halloween");

    // Add appropriate theme class
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "christmas") {
      root.classList.add("theme-christmas");
    } else if (theme === "halloween") {
      root.classList.add("theme-halloween");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    console.log("toggleTheme called, current theme:", theme);
    setTheme((prev) => {
      const currentIndex = THEME_CYCLE.indexOf(prev);
      const nextIndex = (currentIndex + 1) % THEME_CYCLE.length;
      const newTheme = THEME_CYCLE[nextIndex];
      console.log("Setting theme to:", newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
