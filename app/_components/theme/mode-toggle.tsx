// components/theme/mode-toggle.tsx
"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Laptop } from "lucide-react";
import { useEffect, useState } from "react";

export function ModeToggle() {
  const { setTheme, resolvedTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const next = theme === "system" ? "light" : theme === "light" ? "dark" : "system";

  const icon = theme === "system" ? <Laptop className="w-4 h-4" /> : theme === "light" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />;

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(next)}
      title={`Switch to ${next} mode`}
    >
      {icon}
    </Button>
  );
}
