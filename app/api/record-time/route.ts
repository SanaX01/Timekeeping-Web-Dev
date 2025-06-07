// app/api/record-time/route.ts
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { MonthAttendance, ALLOWED_EMAILS } from "@/app/_components/constants";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_NAME = MonthAttendance; // Make sure this matches your actual sheet name

export async function POST(req: NextRequest) {
  const { name, email, action } = await req.json();

  // 🔒 Check if email is allowed
  if (!ALLOWED_EMAILS.includes(email.trim().toLowerCase())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (!name || !email || !action) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const now = new Date();
  const datePH = now.toLocaleDateString("en-GB", {
    timeZone: "Asia/Manila",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedDate = datePH.replace(/^(\w+)\s/, "$1, ");

  const timePH = now.toLocaleTimeString("en-PH", {
    timeZone: "Asia/Manila",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  if (action === "time-in") {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:E`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[name, email, datePH, timePH, ""]],
      },
    });

    return NextResponse.json({ message: "Time In recorded!" });
  }

  if (action === "time-out") {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:E`,
    });

    const rows = response.data.values || [];

    for (let i = rows.length - 1; i >= 1; i--) {
      const [rowName, rowEmail, rowDate, timeIn, timeOut] = rows[i];

      if (
        rowName?.trim().toLowerCase() === name.trim().toLowerCase() &&
        rowEmail?.trim().toLowerCase() === email.trim().toLowerCase() &&
        rowDate?.trim() === formattedDate.trim() &&
        (!timeOut || !timeOut.trim())
      ) {
        const rowIndex = i + 1;
        await sheets.spreadsheets.values.update({
          spreadsheetId: SHEET_ID,
          range: `${SHEET_NAME}!E${rowIndex}`,
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [[timePH]],
          },
        });

        return NextResponse.json({ message: "Time Out recorded!" }, { status: 200 });
      }
    }

    return NextResponse.json({ error: "No matching time-in record for today found." }, { status: 404 });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
