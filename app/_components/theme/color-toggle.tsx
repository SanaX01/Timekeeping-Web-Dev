"use client";

import { useColorTheme } from "../../_components/theme/color-provider";
import { Button } from "@/components/ui/button";

const themes = ["red", "yellow", "orange", "rose", "violet"] as const;

export function ColorToggle() {
  const { color, setColor } = useColorTheme();

  return (
    <div className="flex gap-2 flex-col md:flex-row  justify-center">
      {themes.map((theme, index) => (
        <Button
          key={theme}
          variant={color === theme ? "default" : "outline"}
          onClick={() => setColor(theme)}
          className={`capitalize animate__animated animate__bounceInUp delay-${index}00`}
          size="sm"
        >
          {theme}
        </Button>
      ))}
    </div>
  );
}
