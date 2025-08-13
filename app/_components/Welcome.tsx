"use client";
import { useState, useEffect, useTransition } from "react";
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

export default function Welcome({ disablebutton, user }: { disablebutton?: boolean; user?: any }) {
  const [alert, setAlert] = useState<Alert | null>(null);
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [welcomeName, setWelcomeName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<"time-in" | "time-out" | null>(null);

  // Show toast if alert changes
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

  // Load user info from prop
  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setWelcomeName(user.name || "");
      setName(user.email in allowedUsers ? allowedUsers[user.email as keyof typeof allowedUsers] : "");
    }
  }, [user]);

  const handleRecordTime = (action: "time-in" | "time-out") => {
    setLoading(action);
    startTransition(async () => {
      const result = await recordTime(name, email, action);
      setAlert({ status: result.ok ? "success" : "error", message: result.message });
      setLoading(null);
    });
  };

  const isTimeInDisabled = disablebutton || loading === "time-in" || isPending;

  return (
    <div className="gap-y-10 h-[465px] flex flex-col items-center justify-center w-full">
      <div className="h-[48px] flex justify-center items-end w-full">
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
          disabled={isTimeInDisabled}
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
    </div>
  );
}
