/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Toaster } from "@/components/ui/sonner";

// Custom Theme Provider

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme") as Theme | null;
      const initial = stored ?? "system";
      setThemeState(initial);

      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const isDark =
        initial === "dark" || (initial === "system" && prefersDark);

      document.documentElement.classList.toggle("dark", isDark);
    } catch {
      // ignore
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("theme", newTheme);
    } catch {
      // ignore
    }

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const isDark =
      newTheme === "dark" || (newTheme === "system" && prefersDark);

    document.documentElement.classList.toggle("dark", isDark);
  };

  const toggleTheme = () => {
    // Toggle only between light and dark
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// App Providers

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <Toaster
        richColors
        position="top-right"
        closeButton
        toastOptions={{
          duration: 4000,
        }}
      />
    </ThemeProvider>
  );
}