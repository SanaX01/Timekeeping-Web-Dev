"use client";

import { useState } from "react";
import UserRequestCard from "./UserRequestCard";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

type Request = {
  name: string;
  dateRequested: string;
  createdAt: string;
  reason: string;
  requestId: string;
  status: string;
  type: string;
  feedbackReason?: string;
};

type Props = {
  requests: Request[];
};

export default function FilteredRequestList({ requests }: Props) {
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = statusFilter === "All" ? requests : requests.filter((req) => req.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Requests Forms</h1>
        <div className="flex items-center space-x-4">
          <p>Filter by status</p>
          <Select
            onValueChange={setStatusFilter}
            defaultValue="All"
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <UserRequestCard
              key={item.requestId}
              {...item}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">No requests found for "{statusFilter}"</p>
      )}
    </div>
  );
}
