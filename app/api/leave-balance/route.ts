// app/api/sheet-data/route.ts
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "development") {
  } else {
    const secret = req.headers.get("x-internal-secret");

    if (secret !== process.env.INTERNAL_API_SECRET) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return new Response("Missing email", { status: 400 });
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
  const range = "LeaveBalance!A3:F";

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = response.data.values || [];
  const filteredRows = rows.filter((row) => row[0] === email);

  return NextResponse.json(filteredRows);
}
