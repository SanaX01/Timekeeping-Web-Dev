import React from "react";
import Statistics from "../_components/Statistics";
import Welcome from "../_components/Welcome";
import Clock from "../_components/Clock";
import LeaveBalance from "../_components/LeaveBalance";
import { getServerSession } from "next-auth";
import { getLeaveBalanceByEmail } from "@/lib/getLeaveBalance";
import authOptions from "@/lib/auth";
import { config } from "@/config";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session) return null;

  const leaveData = await getLeaveBalanceByEmail(user?.email as string);

  const res = await fetch(`${config.BASE_URI}/api/sheet-data`, {
    headers: {
      "x-internal-secret": process.env.INTERNAL_API_SECRET!,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return <div className="h-screen flex items-center justify-center text-red-500">Error fetching data: {res.status}</div>;
  }

  const data: string[][] = await res.json();

  // Force YYYY-MM-DD format for both sides
  const todayISO = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Manila" }); // 2025-08-12

  // Filter today's records
  const todayRecords = data
    .filter((row) => {
      const rowDateISO = new Date(row[2]).toLocaleDateString("en-CA", { timeZone: "Asia/Manila" });
      return row[1] === user?.email && rowDateISO === todayISO;
    })
    .map((row) => ({
      id: row[0],
      email: row[1],
      date: row[2],
      timeIn: row[3],
      timeOut: row[4] || null,
      dateTime: new Date(`${row[2]} ${row[3]}`),
    }));

  const latestRecord = todayRecords.sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime())[0];
  const latestTimeIn = latestRecord?.timeIn ?? null;

  return (
    <main className="w-full container flex flex-col mx-auto justify-center text-foreground my-24">
      <Statistics />
      <Welcome />
      {latestTimeIn === null ? (
        <div className="text-center w-full text-2xl mb-5 font-semibold">You didn't time in yet</div>
      ) : (
        <p className="text-center w-full text-xl mb-5 font-semibold">
          Your time-in today: <span className="text-primary">{latestTimeIn}</span>{" "}
        </p>
      )}

      <Clock />

      {/* {user?.role !== "admin" && <LeaveBalance leaveData={leaveData} />} */}
      {/* <LeaveBalance leaveData={leaveData} /> */}
    </main>
  );
}
