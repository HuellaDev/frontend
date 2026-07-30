import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "huella-theme";
const THEME_EVENT = "huella-theme-change";

const getStoredIsDark = (): boolean => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "dark") return true;
  if (stored === "light") return false;
  return document.documentElement.classList.contains("dark");
};

const applyIsDark = (isDark: boolean): void => {
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
  window.dispatchEvent(new Event(THEME_EVENT));
};

export const useTheme = () => {
  const [isDark, setIsDark] = useState<boolean>(getStoredIsDark);

  useEffect(() => {
    const handleChange = (): void => setIsDark(getStoredIsDark());
    window.addEventListener(THEME_EVENT, handleChange);
    return () => window.removeEventListener(THEME_EVENT, handleChange);
  }, []);

  const toggleTheme = useCallback((): void => {
    applyIsDark(!getStoredIsDark());
  }, []);

  return { isDark, toggleTheme };
};