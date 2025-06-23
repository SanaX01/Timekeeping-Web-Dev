// app/api/sheet-data/submit/route.ts
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const sheetName = "OTRequests";

    const now = new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" });

    const values = [
      [
        "", // A: REQ-ID (auto)
        body.email || "", // B: Email
        body.name || "", // C: Name or Code
        body.reason || "", // D: Reason
        body.startTime || "", // E: Start Time
        body.endTime || "", // F: End Time
        body.date || "", // G: Date Request
        now, // H: Date Created
        "Pending", // I: Status
        "", // J: Date Approved/Rejected
        "", // K: OT Hours
        "", // L: Feedback
        body.type || "OT", // M: Type
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:M`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Submit error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
