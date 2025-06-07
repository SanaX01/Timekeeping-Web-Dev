import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth"; // your next-auth config
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { MonthAttendance, ALLOWED_EMAILS } from "@/app/_components/constants";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_NAME = MonthAttendance;

export async function POST(req: NextRequest) {
  // Get the session using NextRequest object - App Router style
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = session.user.email;
  const name = session.user.name || ""; // fallback if no name

  // Parse the JSON body from request
  const { action } = await req.json();

  // Check if the email is allowed
  if (!ALLOWED_EMAILS.includes(email.trim().toLowerCase())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (!name || !email || !action) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Setup Google Sheets API client
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
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:E`,
    });

    const rows = response.data.values || [];

    const alreadyTimeIn = rows.some(([rowName, rowEmail, rowDate]) => {
      return (
        rowName?.trim().toLowerCase() === name.trim().toLowerCase() &&
        rowEmail?.trim().toLowerCase() === email.trim().toLowerCase() &&
        rowDate?.trim() === formattedDate.trim()
      );
    });

    if (alreadyTimeIn) {
      return NextResponse.json({ error: "Time-in already recorded for today." }, { status: 409 });
    }

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
