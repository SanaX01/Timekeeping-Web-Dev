"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { toast } from "sonner";

type RequestProps = {
  name: string;
  dateRequested: string;
  createdAt: string;
  reason: string;
  requestId: string;
  status: string;
};

export default function UserRequestCard({ name, dateRequested, createdAt, reason, requestId, status }: RequestProps) {
  const [open, setOpen] = useState(false); // control dialog

  const handleAction = async (status: "Approved" | "Rejected") => {
    try {
      const res = await fetch("/api/update-request-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Something went wrong");
        return;
      }

      toast.success(`Request ${status}`);
      setOpen(false); // ✅ close dialog on success
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  return (
    <Card
      className={`w-full max-w-md shadow-md rounded-2xl ${
        status === "Approved" ? "border border-green-500" : status === "Rejected" ? "border border-red-500" : "border border-yellow-500"
      }`}
    >
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 text-sm text-primary-foreground">
        <p>
          <strong>Date Requested:</strong>
        </p>
        <p>{dateRequested}</p>
        <p>
          <strong>Created At:</strong>
        </p>
        <p>{createdAt}</p>
      </CardContent>

      <CardFooter className="flex justify-end">
        <AlertDialog
          open={open}
          onOpenChange={setOpen}
        >
          <AlertDialogTrigger asChild>
            <Button variant="outline">View</Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="sm:max-w-lg border-y-primary">
            <AlertDialogHeader>
              <AlertDialogTitle>Request Details</AlertDialogTitle>
            </AlertDialogHeader>

            <div className="space-y-2 text-sm">
              <p>
                <strong>Reason:</strong> {reason}
              </p>
              <p>
                <strong>Request ID:</strong> {requestId}
              </p>
              <p>
                <strong>Status:</strong> {status}
              </p>
            </div>

            <AlertDialogFooter className="mt-4 flex justify-between gap-2">
              <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
              <Button
                variant="destructive"
                className="cursor-pointer"
                onClick={() => handleAction("Rejected")}
              >
                Reject
              </Button>
              <Button
                variant="default"
                className="cursor-pointer"
                onClick={() => handleAction("Approved")}
              >
                Approve
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
