"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

  if (!session) return <div>Please sign in to access this page.</div>;

  return (
    <main className="w-full container flex mx-auto justify-center items-center flex-col gap-y-10 h-[800px]">
      <div className="text-5xl">Welcome, {name}!</div>

      <div className="flex justify-center gap-x-5">
        <Button
          variant="outline"
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
          variant="outline"
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
