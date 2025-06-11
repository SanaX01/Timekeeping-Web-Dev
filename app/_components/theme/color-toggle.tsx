"use client";

import { useColorTheme } from "../../_components/theme/color-provider";
import { Button } from "@/components/ui/button";

const themes = ["default", "red", "yellow", "orange", "rose", "violet", "blue", "teal", "green"] as const;

export function ColorToggle() {
  const { color, setColor } = useColorTheme();

  return (
    <div className="flex gap-2 flex-col md:flex-row  justify-center ">
      {themes.map((theme, index) => (
        <Button
          key={theme}
          variant={color === theme ? "default" : "outline"}
          onClick={() => setColor(theme)}
          className="capitalize animate__animated animate__bounceInUp "
          style={{ animationDelay: `${index * 0.2}s` }}
          size="sm"
        >
          {theme}
        </Button>
      ))}
    </div>
  );
}
