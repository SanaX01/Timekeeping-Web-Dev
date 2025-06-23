import React from "react";
import UserRequestCard from "../_components/UserRequestCard";
import authOptions from "../../lib/auth";
import { getServerSession } from "next-auth";
import { config } from "@/config";

export default async function page() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return <div>You must be signed in and have admin role to view this data.</div>;
  }
  const res = await fetch(`${config.BASE_URI}/api/otrequest`, {
    headers: {
      "x-internal-secret": process.env.INTERNAL_API_SECRET!,
    },
    cache: "no-store",
  });
  const data: string[][] = await res.json();

  if (!res.ok) {
    return <div className="h-screen flex items-center justify-center text-red-500">Error fetching data: {res.status}</div>;
  }
  return (
    <div className="w-7xl mx-auto py-12 px-4 my-24">
      <h1 className="text-3xl font-bold mb-6"> Request Overtime</h1>
      <div className="grid grid-cols-4 gap-6">
        {data.reverse().map((_, index) => (
          <UserRequestCard
            key={index}
            name={`${data[index][2]}`}
            dateRequested={`${data[index][6]}`}
            createdAt={`${data[index][7]}`}
            reason={`${data[index][3]}`}
            requestId={`${data[index][0]}`}
            status={`${data[index][8]}`}
          />
        ))}
      </div>
    </div>
  );
}
