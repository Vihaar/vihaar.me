import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Get theme from localStorage if available
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("vihaar-theme") as Theme;
      if (savedTheme) {
        return savedTheme;
      }
      // Otherwise use system preference
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light"; // Default to light theme
  });

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      localStorage.setItem("vihaar-theme", newTheme);
      return newTheme;
    });
  };

  // Apply theme to document whenever theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Add transitioning class for smooth transitions
    root.classList.add("transitioning");
    
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    // Remove transitioning class after transition completes
    const transitionTimeout = setTimeout(() => {
      root.classList.remove("transitioning");
    }, 500);
    
    return () => clearTimeout(transitionTimeout);
  }, [theme]);

  const value = {
    theme,
    toggleTheme
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
