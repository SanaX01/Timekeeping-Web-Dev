"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function SheetDataViewer() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<string[][]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/sheet-data?email=${encodeURIComponent(session.user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          setData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch sheet data:", err);
          setLoading(false);
        });
    }
  }, [status, session?.user?.email]);

  if (loading)
    return (
      <div className="flex w-full justify-center items-center flex-1 h-full">
        <div className="dot-spinner">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="dot-spinner__dot"
            ></div>
          ))}
        </div>
      </div>
    );

  return (
    <div className="p-4 w-full mx-auto container my-16 flex-1 flex flex-col gap-y-10">
      <h2 className="text-5xl font-bold mb-2 text-primary">Attendance Details</h2>
      <Table>
        <TableCaption>A list of your attendance.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-start">Time In</TableHead>
            <TableHead className="text-start">Time Out</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, i) => (
              <TableRow key={i}>
                {row.map((cell, j) => (
                  <TableCell
                    key={j}
                    className="border px-2 py-1"
                  >
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center"
              >
                No records found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
