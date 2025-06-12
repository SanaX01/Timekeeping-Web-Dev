import React from "react";
import { getServerSession } from "next-auth";
import authOptions from "../../lib/auth";
import { config } from "../../config";
import { getOvertimeToday, getEarliestTimeInThisMonth, getTotalOvertimeThisMonth } from "@/lib/functionStatistics";

// --- Page Component ---
export default async function Statistics() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!session || !email) {
    return <div>You must be signed in and have admin role to view this data.</div>;
  }

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
  const filteredData = data.filter((row) => row[1] === email);

  if (filteredData.length === 0) {
    return <div className="text-center mt-20">No entries found for your account.</div>;
  }

  const latestTimeOut = filteredData[filteredData.length - 1];
  const monthName = new Date().toLocaleString("default", { month: "long" });

  const earliestTimeInThisMonth = getEarliestTimeInThisMonth(filteredData);
  const totalOvertime = getTotalOvertimeThisMonth(filteredData);
  const overtimeToday = getOvertimeToday(filteredData);

  return (
    <div className="absolute left-0 top-0 w-full py-6 px-5 md:px-0 overflow-hidden">
      <div className="grid md:grid-cols-4 grid-cols-1 gap-4 text-center text-foreground">
        <div className="leading-none md:text-start md:border-l-2  border-primary pl-2 animate__animated animate__fadeInLeft delay-500">
          <p className="font-semibold ">Earliest Time In in {monthName}</p>
          <p className="text-sm text-muted-foreground">
            {!earliestTimeInThisMonth ? "No entries found." : `On ${earliestTimeInThisMonth.date} at ${earliestTimeInThisMonth.time}`}
          </p>
        </div>

        <div className="leading-none md:text-start md:border-l-2 border-primary pl-2 animate__animated animate__fadeInLeftBig delay-0">
          <p className="font-semibold">Latest Time Out</p>
          <p className="text-sm text-muted-foreground">
            {latestTimeOut?.[4] ? `On ${latestTimeOut[2]} at ${latestTimeOut[4]}` : "No entries found."}
          </p>
        </div>

        <div className="leading-none md:text-end md:border-r-2 border-primary pr-2 animate__animated animate__fadeInRightBig delay-0">
          <p className="font-semibold">Total Overtime in {monthName}</p>
          <p className="text-sm text-muted-foreground">{totalOvertime > 0 ? `${totalOvertime} hours` : "No overtime this month"}</p>
        </div>

        <div className="leading-none md:text-end md:border-r-2 border-primary pr-2 animate__animated animate__fadeInRight delay-500">
          <p className="font-semibold">Overtime Today</p>
          <p className="text-sm text-muted-foreground">{overtimeToday > 0 ? `${overtimeToday} hours` : "No overtime today"}</p>
        </div>
      </div>
    </div>
  );
}
