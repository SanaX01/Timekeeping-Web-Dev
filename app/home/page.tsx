"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ColorToggle } from "../_components/theme/color-toggle";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ModeToggle } from "../_components/theme/mode-toggle";

export default function Home() {
  const { data: session } = useSession();
  const [alert, setAlert] = useState<{ status: string; message: string } | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<"time-in" | "time-out" | null>(null);

  useEffect(() => {
    if (alert) {
      toast(alert.status, {
        description: alert.message,
        action: {
          label: "Dismiss",
          onClick: () => setAlert(null),
        },
      });
      setAlert(null);
    }
  }, [alert]);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  async function recordTime(action: "time-in" | "time-out") {
    setLoading(action);
    const res = await fetch("/api/record-time", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, action }),
    });
    const data = await res.json();
    setAlert({ status: res.ok ? "Success" : "Error", message: data.message || data.error });
    setLoading(null);
  }

  return (
    <main className="w-full container flex mx-auto justify-center items-center flex-col gap-y-10 h-[800px] text-foreground relative">
      <div className="text-5xl ">Welcome, {name}!</div>

      <div className="flex justify-center gap-x-5">
        <Button
          onClick={() => recordTime("time-in")}
          className="cursor-pointer flex items-center justify-center w-32 h-12"
          disabled={loading === "time-in"}
        >
          {loading === "time-in" ? (
            <div className="loader">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className={`bar${i + 1}`}
                />
              ))}
            </div>
          ) : (
            "Time In"
          )}
        </Button>

        <Button
          onClick={() => recordTime("time-out")}
          className="cursor-pointer flex items-center justify-center w-32 h-12"
          disabled={loading === "time-out"}
        >
          {loading === "time-out" ? (
            <div className="loader ">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className={`bar${i + 1}`}
                />
              ))}
            </div>
          ) : (
            "Time Out"
          )}
        </Button>
      </div>
      <div className="absolute bottom-0 left-0 flex items-center justify-between p-4 w-full">
        <div className="flex items-center gap-2">
          <p>Switch Theme:</p>
          <ColorToggle />
        </div>
        <div className="flex items-center gap-4">
          <HoverCard>
            <HoverCardTrigger className="cursor-pointer">
              <span className="text-sm">Help</span>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <p className="text-sm">Click 'Time In' to log when you start work and 'Time Out' to log when you finish for the day.</p>
            </HoverCardContent>
          </HoverCard>
          <ModeToggle />
        </div>
      </div>
    </main>
  );
}
