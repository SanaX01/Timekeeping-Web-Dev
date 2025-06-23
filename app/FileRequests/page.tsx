import React, { Suspense } from "react";
import authOptions from "../../lib/auth";
import { getServerSession } from "next-auth";
import { config } from "@/config";
import FilteredRequestList from "../_components/FilteredRequesLIst";
import FilteredRequestListSkeleton from "../_components/FilteredRequestListSkeleton/FilteredRequestListSkeleton";

export default async function Page() {
  const session = await getServerSession(authOptions);
  const name = session?.user?.name;

  if (!session || !session.user?.email) {
    return <div>You must be signed in and have admin role to view this data.</div>;
  }
  await new Promise((res) => setTimeout(res, 2500));

  const res = await fetch(`${config.BASE_URI}/api/otrequest`, {
    headers: {
      "x-internal-secret": process.env.INTERNAL_API_SECRET!,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return <div className="h-screen flex items-center justify-center text-red-500">Error fetching data: {res.status}</div>;
  }

  const raw: string[][] = await res.json();

  const requests = raw.reverse().map((row) => ({
    requestId: row[0],
    name: row[2],
    reason: row[3],
    dateRequested: row[6],
    createdAt: row[7],
    status: row[8],
    feedbackReason: row[11],
    type: row[12],
  }));

  return (
    <div className="w-full container flex flex-col mx-auto justify-center text-foreground my-24">
      <Suspense fallback={<FilteredRequestListSkeleton />}>
        <FilteredRequestList requests={requests} />
      </Suspense>
    </div>
  );
}
