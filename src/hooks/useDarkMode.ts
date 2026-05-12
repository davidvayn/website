"use client";

import { useSyncExternalStore, useCallback } from "react";

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): boolean {
  return localStorage.getItem("theme") === "dark";
}

function getServerSnapshot(): boolean {
  return false;
}

export function useDarkMode() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Apply theme attribute on first client render
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light"
    );
  }

  const toggle = useCallback(() => {
    const next = !getSnapshot();
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.setAttribute(
      "data-theme",
      next ? "dark" : "light"
    );
    emitChange();
  }, []);

  return { isDark, toggle };
}
