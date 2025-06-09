"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { MonthAttendance } from "./constants";

export default function SheetDataViewer() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<string[][]>([]);
  const [filteredData, setFilteredData] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/sheet-data`)
        .then((res) => res.json())
        .then((data) => {
          setData(data);
          setFilteredData(data); 
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch sheet data:", err);
          setLoading(false);
        });
    }
  }, [status, session?.user?.email]);

  useEffect(() => {
    const lower = filter.toLowerCase();
    const filtered = data.filter(
      (row) =>
        row[0]?.toLowerCase().includes(lower) || // Name
        row[1]?.toLowerCase().includes(lower) // Email
    );
    setFilteredData(filtered);
  }, [filter, data]);

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
      <h2 className="text-5xl text-center">
        Month of <span className="underline underline-offset-8">{MonthAttendance}</span>
      </h2>
      <div className="flex justify-between items-center">
        <h3 className="text-4xl font-bold mb-2 text-primary">Attendance Details</h3>

       
        <Input
          placeholder="Search by name or email..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableCaption className="mb-20">A list of your attendance.</TableCaption>
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
          {filteredData.length > 0 ? (
            filteredData.map((row, i) => (
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
