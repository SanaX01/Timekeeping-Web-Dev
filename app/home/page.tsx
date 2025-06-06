"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Home() {
  const { data: session } = useSession();
  const [alert, setAlert] = useState<{ status: string; message: string } | null>(null);

  const [name, setName] = useState("");
  const [welcomeName, setWelcomeName] = useState("");
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
      setEmail(session.user.email || "");
      setWelcomeName(session.user.name || "");
      const emailToName: Record<string, string> = {
        "grunting.jelly@auroramy.com": "Christian Jade Tolentino",
        "van.gogh@auroramy.com": "Ralph Matthew De Leon",
      };
      setName(emailToName[session.user.email!] || "");
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
    <main className="w-full container flex mx-auto justify-center items-center flex-col gap-y-10 flex-1 text-foreground">
      <div className="text-5xl animate__animated animate__fadeIn">Welcome, {welcomeName}!</div>

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
    </main>
  );
}
