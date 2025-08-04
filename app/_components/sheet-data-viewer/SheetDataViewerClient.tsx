"use client";

import { useState, useEffect } from "react";
import React from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { months } from "../constants";
import { YearAttendance } from "../constants";

interface Props {
  initialData: string[][];
}

function parseTimeInToMinutes(timeStr: string): number {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier.toLowerCase() === "pm" && hours !== 12) hours += 12;
  if (modifier.toLowerCase() === "am" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

export default function SheetDataViewerClient({ initialData }: Props) {
  const [data] = useState(initialData);
  const [filter, setFilter] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [filteredData, setFilteredData] = useState<string[][]>([]);

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

        if (dateA.getTime() !== dateB.getTime()) {
          return dateB.getTime() - dateA.getTime();
        }

        const timeA = parseTimeInToMinutes(a[3]);
        const timeB = parseTimeInToMinutes(b[3]);

        return timeB - timeA; // latest time-in first
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
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-start">Time In</TableHead>
            <TableHead className="text-start">Time Out</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length > 0 ? (
            (() => {
              let currentDay = "";
              let rowCount = 0;

              return filteredData.map((row, i) => {
                const date = row[2];
                const isNewDate = currentDay !== date;

                if (isNewDate) {
                  currentDay = date;
                  rowCount = 1;
                } else {
                  rowCount++;
                }

                const prevDate = filteredData[i - 1]?.[2];
                const showGap = i > 0 && date !== prevDate;

                return (
                  <React.Fragment key={i}>
                    {showGap && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="py-3 bg-primary/10"
                        />
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell className="border px-2 py-1 font-mono text-muted-foreground">{rowCount}</TableCell>
                      {row.map((cell, j) => {
                        const isTimeIn = j === 3;
                        const isLate = isTimeIn && parseTimeInToMinutes(cell) > 9 * 60;

                        return (
                          <TableCell
                            key={j}
                            className={`border px-2 py-1 ${isTimeIn && isLate ? "bg-red-500/20" : ""}`}
                          >
                            {cell}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </React.Fragment>
                );
              });
            })()
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
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
