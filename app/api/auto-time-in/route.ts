// app/api/record-time/route.ts
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { YearAttendance, allowedUsers } from "@/app/_components/constants"; // Adjust paths as needed

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_NAME = YearAttendance;
// CRON_SECRET will be set in Vercel Environment Variables
const CRON_SECRET = process.env.CRON_SECRET!;

// Ensure this function runs dynamically on every request, not cached
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // --- Security Check (Essential for Cron Jobs) ---
  // Vercel sends the CRON_SECRET as an Authorization header (Bearer token)
  const authHeader = req.headers.get("authorization");
  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    console.warn("Unauthorized attempt to access cron endpoint.");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // --- End Security Check ---

  console.log("Vercel Cron Job triggered: Auto-time-in process started.");

  // Initialize Google Sheets API (ensure GOOGLE_SERVICE_ACCOUNT_KEY is set)
  const authClient = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth: authClient });

  // Get current time in Manila (PST)
  const now = new Date();
  const datePH = now.toLocaleDateString("en-GB", {
    timeZone: "Asia/Manila",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedDate = datePH.replace(/^(\w+)\s/, "$1, "); // Example: "Wednesday, 12 June 2025"

  const timePH = now.toLocaleTimeString("en-PH", {
    timeZone: "Asia/Manila",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const responses: any[] = [];

  for (const [email, name] of Object.entries(allowedUsers)) {
    try {
      // 1. Check if user already timed-in for today
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `${SHEET_NAME}!A:E`, // Assuming columns A:E contain Name, Email, Date, Time, Action
      });

      const rows = response.data.values || [];
      const alreadyTimeIn = rows.some(([rowName, rowEmail, rowDate]) => {
        return (
          rowName?.trim().toLowerCase() === name.trim().toLowerCase() &&
          rowEmail?.trim().toLowerCase() === email.trim().toLowerCase() &&
          rowDate?.trim() === formattedDate.trim()
        );
      });

      if (!alreadyTimeIn) {
        // 2. If not timed in, append the new record
        await sheets.spreadsheets.values.append({
          spreadsheetId: SHEET_ID,
          range: `${SHEET_NAME}!A:E`,
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [[name, email, datePH, timePH, "Time In (Auto)"]], // Added "Time In (Auto)" for clarity
          },
        });
        responses.push({ email, status: "Time-in recorded", time: timePH });
        console.log(`Auto-timed in: ${name} (${email}) at ${timePH}`);
      } else {
        responses.push({ email, status: "Already timed-in today" });
        console.log(`Skipped auto-time-in for ${name} (${email}): Already timed-in today.`);
      }
    } catch (error: any) {
      console.error(`Error processing ${name} (${email}):`, error.message);
      responses.push({ email, status: "Error", message: error.message });
    }
  }

  return NextResponse.json({ ok: true, results: responses });
}
