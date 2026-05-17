"use client";

import { useEffect, useCallback } from "react";

const storageKey = "theme";
const defaultTheme = "dark";

function applyTheme(theme: string) {
  const root = document.documentElement;
  const nextTheme = theme === "light" ? "light" : "dark";

  root.classList.remove("light", "dark");
  root.classList.add(nextTheme);
  root.style.colorScheme = nextTheme;
}

export function useThemeToggle() {
  useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey) || defaultTheme;
    applyTheme(storedTheme);
  }, []);

  return useCallback(() => {
    const isDark = document.documentElement.classList.contains("dark");
    const nextTheme = isDark ? "light" : "dark";

    applyTheme(nextTheme);
    localStorage.setItem(storageKey, nextTheme);
  }, []);
}
