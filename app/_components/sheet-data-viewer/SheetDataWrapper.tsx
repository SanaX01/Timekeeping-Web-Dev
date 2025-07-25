import { getServerSession } from "next-auth";
import authOptions from "../../../lib/auth";
import SheetDataViewerClient from "./SheetDataViewerClient";
import { config } from "../../../config";

export default async function SheetDataWrapper() {
  const session = await getServerSession(authOptions);

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

  return <SheetDataViewerClient initialData={data} />;
}
