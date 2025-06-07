"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ColorTheme = "default" | "red" | "yellow" | "orange" | "rose" | "violet" | "blue";

const ColorThemeContext = createContext<{
  color: ColorTheme;
  setColor: (c: ColorTheme) => void;
}>({
  color: "default",
  setColor: () => {},
});

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  const [color, setColor] = useState<ColorTheme>("default");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("color-theme") as ColorTheme;
      if (stored) setColor(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", color);
    localStorage.setItem("color-theme", color);
  }, [color]);

  return <ColorThemeContext.Provider value={{ color, setColor }}>{children}</ColorThemeContext.Provider>;
}

export const useColorTheme = () => useContext(ColorThemeContext);
