"use server";

export async function recordTime(name: string, email: string, action: "time-in" | "time-out") {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"; // fallback for local dev

  const res = await fetch(`${baseUrl}/api/record-time`, {
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
