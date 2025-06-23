import React from "react";
import Statistics from "../_components/Statistics";
import Welcome from "../_components/Welcome";
import Clock from "../_components/Clock";
import LeaveBalance from "../_components/LeaveBalance";
import { getServerSession } from "next-auth";
import { getLeaveBalanceByEmail } from "@/lib/getLeaveBalance";
import authOptions from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session) return null;

  const leaveData = await getLeaveBalanceByEmail(user?.email as string);
  return (
    <main className="w-full container flex flex-col mx-auto justify-center text-foreground my-24">
      <Statistics />
      <Welcome />
      <Clock />

      {/* {user?.role !== "admin" && <LeaveBalance leaveData={leaveData} />} */}
      {/* <LeaveBalance leaveData={leaveData} /> */}
    </main>
  );
}
