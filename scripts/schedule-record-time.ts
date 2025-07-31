// scripts/schedule-record-time.ts

import { Client } from "@upstash/qstash";
import "dotenv/config"; // for loading .env file

async function schedule() {
  const client = new Client({
    token: process.env.QSTASH_TOKEN!,
  });

  await client.publish({
    url: "https://wide-places-scream.loca.lt/api/sync-to-sheets",
    schedule: "0 19 * * *", // 2am UTC
    headers: {
      Authorization: "Bearer cf237bd1fe066fa395e4f105fc8b3521b72e4489293a82c5d08173c7d5a8bc5c",
    },
  });

  console.log("Job scheduled successfully!");
}

schedule().catch(console.error);
