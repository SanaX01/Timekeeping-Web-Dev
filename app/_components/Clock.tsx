"use client";

import { useEffect, useState } from "react";

export default function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick(); // Set initial value
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!now) return null; // or a skeleton/placeholder

  const day = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(now);
  const date = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" }).format(now);
  const manilaTime = new Intl.DateTimeFormat("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Manila",
  }).format(now);

  return (
    <div className="font-mono text-sm text-primary-foreground">
      {day}, {date} — {manilaTime} GMT+8 (Asia/Manila)
    </div>
  );
}
