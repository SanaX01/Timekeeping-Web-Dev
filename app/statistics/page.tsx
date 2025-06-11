import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { getServerSession } from "next-auth";
import authOptions from "../../lib/auth";
import { config } from "../../config";

function parseTimeToDateObject(timeStr: string): Date {
  return new Date(`1970-01-01T${convertTo24Hour(timeStr)}`);
}

function convertTo24Hour(time12h: string): string {
  const [time, modifier] = time12h.toLowerCase().split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "pm" && hours !== 12) hours += 12;
  if (modifier === "am" && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;
}

export default async function page() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!session || !session.user?.email) {
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
  console.log("filteredData ==> ", filteredData);

  if (filteredData.length === 0) {
    return <div className="text-center mt-20">No entries found for your account.</div>;
  }

  const earliestRow = filteredData.reduce((earliest, current) => {
    const earliestTime = parseTimeToDateObject(earliest[3]);
    const currentTime = parseTimeToDateObject(current[3]);
    return currentTime < earliestTime ? current : earliest;
  });

  const earliestTime = earliestRow[3];

  return (
    <div className="w-7xl mx-auto py-12 px-4 my-24">
      <div className="grid grid-cols-3 gap-6">
        <Card className="hover:bg-background">
          <CardHeader>
            <CardTitle className="text-xl">Earliest Time In:</CardTitle>
            <p className="text-sm text-muted-foreground">{earliestRow[2]}</p>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{earliestTime}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
