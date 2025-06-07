// components/sheet-data-viewer/SheetDataWrapper.tsx (Server Component)
import { getServerSession } from "next-auth";
import authOptions from "../../../lib/auth"; // adjust based on your auth setup
import SheetDataViewerClient from "./SheetDataViewerClient";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default async function SheetDataWrapper() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return <div>You must be signed in to view this data.</div>;
  }

  const res = await fetch(`${baseUrl}/api/sheet-data`, {
    headers: {
      Cookie: "", // Optionally include auth headers or cookies if needed
    },
    cache: "no-store", // To prevent caching if needed
  });

  const data: string[][] = await res.json();

  return <SheetDataViewerClient initialData={data} />;
}
