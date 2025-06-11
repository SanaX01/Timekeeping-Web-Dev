"use client";
import React from "react";
import { useState, useEffect, useTransition } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { recordTime } from "../actions/recordTime";
import { allowedUsers } from "../_components/constants";

import { Skeleton } from "@/components/ui/skeleton";

type ToastTypes = "success" | "info" | "warning" | "error" | "loading" | "default";

type Alert = {
  status: ToastTypes;
  message: string;
};

export default function Welcome() {
  const { data: session } = useSession();
  const [alert, setAlert] = useState<Alert | null>(null);
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [welcomeName, setWelcomeName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<"time-in" | "time-out" | null>(null);

  useEffect(() => {
    if (alert) {
      const toastFnMap: Record<ToastTypes, (msg: string, opts?: any) => void> = {
        success: toast.success,
        info: toast.info,
        warning: toast.warning,
        error: toast.error,
        loading: toast.loading,
        default: toast.info,
      };
      toastFnMap[alert.status](alert.status.charAt(0).toUpperCase() + alert.status.slice(1), {
        description: alert.message,
      });
      setAlert(null);
    }
  }, [alert]);

  useEffect(() => {
    if (session?.user) {
      setEmail(session.user.email || "");
      setWelcomeName(session.user.name || "");
      setName(session.user.email! in allowedUsers ? allowedUsers[session.user.email! as keyof typeof allowedUsers] : "");
    }
  }, [session]);

  // useEffect(() => {
  //   const now = new Date();

  //   // Convert to PH time manually (UTC+8)
  //   const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  //   const phNow = new Date(utc + 8 * 60 * 60 * 1000);

  //   const currentDateString = phNow.toDateString();
  //   const hasTimedInToday = localStorage.getItem("hasTimedInToday");

  //   if (!name || !email || hasTimedInToday === currentDateString) return;

  //   // === Customizable Window ===
  //   const START_HOUR = 6;
  //   const START_MINUTE = 0;
  //   const END_HOUR = 8;
  //   const END_MINUTE = 59;

  //   const startTime = new Date(phNow);
  //   startTime.setHours(START_HOUR, START_MINUTE, 0, 0);

  //   const endTime = new Date(phNow);
  //   endTime.setHours(END_HOUR, END_MINUTE, 0, 0);

  //   const randomTime = new Date(startTime.getTime() + Math.random() * (endTime.getTime() - startTime.getTime()));

  //   if (phNow >= startTime && phNow <= endTime) {
  //     const delay = randomTime.getTime() - phNow.getTime();

  //     if (delay > 0) {
  //       const timeout = setTimeout(() => {
  //         handleRecordTime("time-in");
  //         localStorage.setItem("hasTimedInToday", currentDateString);
  //       }, delay);

  //       return () => clearTimeout(timeout);
  //     }
  //   }
  // }, [name, email]);

  const handleRecordTime = (action: "time-in" | "time-out") => {
    setLoading(action);
    startTransition(async () => {
      const result = await recordTime(name, email, action);
      setAlert({ status: result.ok ? "success" : "error", message: result.message });
      setLoading(null);
    });
  };
  return (
    <>
      <div className="h-[48px] flex items-end">
        {welcomeName === "" ? (
          <Skeleton className="h-[20px] w-[650px] rounded-full" />
        ) : (
          <h1 className="text-5xl animate__animated animate__fadeIn text-center">Welcome, {welcomeName}!</h1>
        )}
      </div>
      <div className="flex justify-center gap-x-5">
        <Button
          onClick={() => handleRecordTime("time-in")}
          className="cursor-pointer flex items-center justify-center w-32 h-12"
          disabled={loading === "time-in" || isPending}
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
          onClick={() => handleRecordTime("time-out")}
          className="cursor-pointer flex items-center justify-center w-32 h-12"
          disabled={loading === "time-out" || isPending}
        >
          {loading === "time-out" ? (
            <div className="loader">
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
    </>
  );
}
