"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export default function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick(); // Set initial value
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const content = now ? (
    <div className="font-mono text-sm text-foreground h-full">
      {new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(now)},{" "}
      {new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" }).format(now)}
      {" — "}
      {new Intl.DateTimeFormat("en-PH", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Asia/Manila",
      }).format(now)}{" "}
      GMT+8 (Asia/Manila)
    </div>
  ) : (
    <Skeleton className="h-full w-[431px] rounded-full" />
  );

  return <div className="h-[20px] flex items-center">{content}</div>;
}
