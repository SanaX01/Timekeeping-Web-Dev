import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export async function POST(req: NextRequest) {
  const redis = Redis.fromEnv();
  const { name, email, action } = await req.json();

  console.log("Route auth header:", req.headers.get("x-internal-secret"));
  if (process.env.NODE_ENV === "production") {
    const token = req.headers.get("x-internal-secret"); // <-- this might be null in dev
    if (token !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized o Dito" }, { status: 401 });
    }
  }

  if (!name || !email || !["time-in", "time-out"].includes(action)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const date = new Date().toLocaleDateString("en-PH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const now = new Date().toLocaleTimeString("en-PH", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const key = `attendance:${email}:${date}`;
  const existing = await redis.hgetall(key);

  // Only update timeIn or timeOut
  const newData = action === "time-in" ? { timeIn: now } : { timeOut: now };

  await redis.hset(key, {
    name,
    email,
    date,
    ...existing,
    ...newData,
    synced: "false", // always mark as unsynced until Sheets confirms
  });

  return NextResponse.json({
    message: `Successfully recorded ${action === "time-in" ? "Time In" : "Time Out"}`,
  });
}
