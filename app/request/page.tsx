import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { config } from "@/config";
import RequestFileClient from "../_components/RequestFileClient";

export default async function RequestFilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return <div className="p-6 text-red-600">You must be signed in to view this page.</div>;
  }

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

  return <RequestFileClient rawData={raw} />;
}
