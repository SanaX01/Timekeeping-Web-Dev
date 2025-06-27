// app/api/sheet-data/submit/route.ts
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

function calculateOtHours(start: string, end: string): number {
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);

  const startDate = new Date(0, 0, 0, startH, startM);
  const endDate = new Date(0, 0, 0, endH, endM);
  const dutyOut = new Date(0, 0, 0, 18, 0); // 6:00 PM

  // Handle overnight OT (e.g., 9 PM to 1 AM)
  if (endDate < startDate) endDate.setDate(endDate.getDate() + 1);

  const actualStart = startDate < dutyOut ? dutyOut : startDate;

  const diffMs = endDate.getTime() - actualStart.getTime();
  const diffHrs = diffMs / (1000 * 60 * 60);

  return diffHrs > 0 ? diffHrs : 0;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const calculateOThours = calculateOtHours(body.startTime, body.endTime).toFixed(2) + " OT Hours";
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
        calculateOThours || "", // K: OT Hours
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
