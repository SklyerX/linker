"use client";

import { useEffect } from "react";

import themes from "../../../public/themes.json";

type theme = keyof typeof themes;

interface Props {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: Props) {
  useEffect(() => {
    const theme = localStorage.getItem("theme") ?? "zinc-light";
    if (theme) {
      if (!Object.keys(themes).includes(theme)) {
        window.localStorage.setItem("theme", "zinc-light");
      } else {
        for (const [key, value] of Object.entries(themes[theme as theme])) {
          document.body.style.setProperty(key, value);
          window.localStorage.setItem("theme", theme as theme);
        }
      }
    }
  }, []);

  return <>{children}</>;
}
