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
import { updateRequestStatus } from "@/app/actions/update-request-status";
import { useRouter } from "next/navigation";

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
  const [feedbackDialog, setFeedbackDialog] = useState(false); // reject dialog
  const [feedback, setFeedback] = useState("");
  const router = useRouter();

  const handleAction = async (status: "Approved" | "Rejected") => {
    const result = await updateRequestStatus({
      requestId,
      status,
      feedback: status === "Rejected" ? feedback : "",
    });

    if (result.success) {
      toast.success(`Request ${status}`);
      setFeedback("");
      setFeedbackDialog(false);
      setOpen(false);
      router.refresh(); // ✅ will refresh border color
    } else {
      toast.error(result.error || "Something went wrong");
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
                onClick={() => setFeedbackDialog(true)}
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
        <AlertDialog
          open={feedbackDialog}
          onOpenChange={setFeedbackDialog}
        >
          <AlertDialogContent className="sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>Reject Request</AlertDialogTitle>
            </AlertDialogHeader>

            <div className="space-y-2 text-sm">
              <p>Please provide a reason for rejection:</p>
              <textarea
                className="w-full min-h-[80px] p-2 border border-input rounded-md text-sm"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Reason for rejection"
              />
            </div>

            <AlertDialogFooter className="mt-4 flex justify-between">
              <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={() => handleAction("Rejected")}
              >
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
