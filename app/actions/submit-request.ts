"use server";
import { config } from "../../config";

export async function submitRequest(payload: {
  email: string;
  name: string;
  reason: string;
  startTime: string;
  endTime: string;
  date: string;
  type: string;
}) {
  try {
    const res = await fetch(`${config.BASE_URI}/api/submit-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": process.env.NEXT_PUBLIC_INTERNAL_API_SECRET!, // if you check for this
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to submit");

    return { success: true };
  } catch (err) {
    console.error("Submit error:", err);
    return { success: false, error: "Submit failed" };
  }
}
