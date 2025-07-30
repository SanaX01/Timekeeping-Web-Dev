import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { YearAttendance } from "@/app/_components/constants";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;

export async function GET(req: NextRequest) {
  const redis = Redis.fromEnv();
  const SHEET_NAME = YearAttendance;

  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  const keys = await redis.keys("attendance:*");

  let syncedCount = 0;

  for (const key of keys) {
    const record = await redis.hgetall(key);

    if (record?.synced === "true") continue;

    if (record?.timeIn) {
      const values = [[record.name, record.email, record.date, record.timeIn, record.timeOut || ""]];

      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: `${SHEET_NAME}!A:E`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values },
      });

      await redis.hset(key, { synced: true });
      syncedCount++;
    }
  }

  return NextResponse.json({ message: `Synced ${syncedCount} records to Google Sheets.` });
}
