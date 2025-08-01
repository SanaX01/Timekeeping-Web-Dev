"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { months } from "../constants";
import { YearAttendance } from "../constants";
import React from "react";

interface Props {
  initialData: string[][];
}

export default function SheetDataViewerClient({ initialData }: Props) {
  const [data, setData] = useState(initialData);
  const [filter, setFilter] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [filteredData, setFilteredData] = useState(initialData);

  useEffect(() => {
    const lower = filter.toLowerCase();

    const filtered = data
      .filter((row) => {
        const nameMatch = row[0]?.toLowerCase().includes(lower);
        const emailMatch = row[1]?.toLowerCase().includes(lower);

        const date = new Date(row[2]);
        const monthMatch = selectedMonth === "All" || date.toLocaleString("default", { month: "long" }) === selectedMonth;

        return (nameMatch || emailMatch) && monthMatch;
      })
      .sort((a, b) => {
        const dateA = new Date(a[2]);
        const dateB = new Date(b[2]);
        return dateB.getTime() - dateA.getTime(); // descending order
      });

    setFilteredData(filtered);
  }, [filter, selectedMonth, data]);

  return (
    <div className="p-4 w-full mx-auto container my-24 flex-1 flex flex-col gap-y-10">
      <h2 className="text-5xl text-center">
        Year of <span className="underline underline-offset-8">{YearAttendance}</span>
      </h2>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-4xl font-bold text-primary">Attendance Details</h3>

        <div className="flex gap-2">
          <Input
            placeholder="Search by name or email..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
          />
          <Select
            value={selectedMonth}
            onValueChange={setSelectedMonth}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem
                  key={month}
                  value={month}
                >
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableCaption className="mb-20">Attendance list.</TableCaption>
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
            filteredData.map((row, i) => {
              const currentDate = row[2];
              const prevDate = filteredData[i - 1]?.[2];
              const showGap = i > 0 && currentDate !== prevDate;

              return (
                <React.Fragment key={i}>
                  {showGap && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="py-3 bg-primary/10"
                      />
                    </TableRow>
                  )}
                  <TableRow>
                    {row.map((cell, j) => (
                      <TableCell
                        key={j}
                        className="border px-2 py-1"
                      >
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                </React.Fragment>
              );
            })
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
