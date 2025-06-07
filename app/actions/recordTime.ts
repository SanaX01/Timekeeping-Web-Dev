"use server";
import { config } from "../../config";

export async function recordTime(name: string, email: string, action: "time-in" | "time-out") {
  const res = await fetch(`${config.BASE_URI}/api/record-time`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, action }),
  });

  const data = await res.json();

  return {
    ok: res.ok,
    message: data.message || data.error || "Unknown response",
  };
}
