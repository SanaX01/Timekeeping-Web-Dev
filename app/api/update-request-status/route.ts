import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { ALLOWED_EMAILS } from "@/app/_components/constants";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_NAME = "OTRequests"; // change if your sheet name is different

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = session.user.email.toLowerCase();
  if (!ALLOWED_EMAILS.includes(email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { requestId, status } = await req.json();

  if (!requestId || !["Approved", "Rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:J`, // covers columns A to J
    });

    const rows = response.data.values || [];

    // Find the row with matching OT ID (requestId) in column A
    const rowIndex = rows.findIndex((row) => row[0] === requestId);

    if (rowIndex === -1) {
      return NextResponse.json({ error: "Request ID not found" }, { status: 404 });
    }

    const datePH = new Date().toLocaleString("en-PH", {
      timeZone: "Asia/Manila",
    });

    // Column I (index 8) = Status, Column J (index 9) = Date Approved/Rejected
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!I${rowIndex + 1}:J${rowIndex + 1}`, // +1 because Sheets are 1-indexed
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[status, datePH]],
      },
    });

    return NextResponse.json({ message: `Request ${status} successfully.` });
  } catch (err) {
    console.error("Google Sheets update error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
