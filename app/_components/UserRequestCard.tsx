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
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy } from "lucide-react";
import { config } from "@/config";

type RequestProps = {
  name: string;
  dateRequested: string;
  createdAt: string;
  reason: string;
  requestId: string;
  status: string;
  type: string;
  feedbackReason?: string;
};

export default function UserRequestCard({ name, dateRequested, createdAt, reason, requestId, status, type, feedbackReason }: RequestProps) {
  const session = useSession();
  const role = session.data?.user?.role || "user"; // default to user if session is not available
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
    <Card className={`w-full max-w-md shadow-md rounded-2xl `}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">{name}</CardTitle>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              status === "Approved"
                ? "bg-green-100 text-green-800"
                : status === "Rejected"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {status}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Request ID: {requestId}</p>
      </CardHeader>

      <CardContent className="text-sm text-muted-foreground space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-medium text-foreground">Type:</span>
          <span className="capitalize">{type}</span>
        </div>

        <div>
          <p className="font-medium text-foreground">Date Requested:</p>
          <p>{dateRequested}</p>
        </div>

        <div>
          <p className="font-medium text-foreground">Created At:</p>
          <p>{createdAt}</p>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end">
        <AlertDialog
          open={open}
          onOpenChange={setOpen}
        >
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="cursor-pointer"
            >
              View
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="sm:max-w-lg rounded-xl p-6 bg-background border border-border">
            <AlertDialogHeader className="mb-4">
              <AlertDialogTitle className="text-xl font-semibold text-foreground flex items-center justify-between">
                <div>Request Details</div>
                <Copy
                  className="w-5 h-5 cursor-pointer text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    navigator.clipboard.writeText(`${config.BASE_URI}/request?id=${requestId}`); // or any value you want to copy
                    toast.success("Copied to clipboard");
                  }}
                />
              </AlertDialogTitle>
            </AlertDialogHeader>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-foreground">Reason:</span>
                <span className="text-right text-muted-foreground">{reason}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-foreground">Request ID:</span>
                <span className="text-muted-foreground">{requestId}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium text-foreground">Status:</span>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    status === "Approved"
                      ? "bg-green-500/10 text-green-500"
                      : status === "Rejected"
                      ? "bg-red-500/10 text-red-500"
                      : "bg-yellow-500/10 text-yellow-500"
                  }`}
                >
                  {status}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-foreground">Type:</span>
                <span className="capitalize text-muted-foreground">{type}</span>
              </div>

              {status === "Rejected" && (
                <div className="border border-red-400/30 bg-red-500/5 p-4 rounded-md">
                  <p className="text-sm font-medium text-red-500 mb-1">Rejection Feedback</p>
                  <p className="text-sm text-red-400 italic">{feedbackReason || "No feedback provided."}</p>
                </div>
              )}
            </div>

            <AlertDialogFooter
              className="mt-6 flex justify-between"
              style={{ justifyContent: "space-between" }}
            >
              <AlertDialogCancel className="cursor-pointer border-2 px-2 rounded-md">Cancel</AlertDialogCancel>
              {role === "admin" && (
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    className="cursor-pointer hover:scale-95 transition-transform"
                    onClick={() => setFeedbackDialog(true)}
                  >
                    Reject
                  </Button>
                  <Button
                    className="bg-green-800 hover:bg-green-800 cursor-pointer hover:scale-95 transition-transform"
                    onClick={() => handleAction("Approved")}
                  >
                    Approve
                  </Button>
                </div>
              )}
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
                className="cursor-pointer"
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
