// app/api/sheet-data/route.ts
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { MonthAttendance } from "@/app/_components/constants";
export async function GET(req: NextRequest) {
  
  if (process.env.NODE_ENV !== "development") {
    return new Response("Not Found", { status: 404 });
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const range = `${MonthAttendance}!A2:E`;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = response.data.values || [];
  // const filteredRows = rows.filter((row) => row[1] === email);

  return NextResponse.json(rows);
}
