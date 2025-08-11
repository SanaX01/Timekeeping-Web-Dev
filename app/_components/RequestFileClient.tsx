"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { updateRequestStatus } from "@/app/actions/update-request-status";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

type Request = {
  id: string;
  email: string;
  name: string;
  reason: string;
  startTime: string;
  endTime: string;
  dateRequest: string;
  dateCreated: string;
  status: string;
  dateApprovedOrRejected: string;
  otHours: string;
  feedback: string;
  type: string;
};

export default function RequestFileClient({ rawData }: { rawData: string[][] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const role = session?.user?.role ?? "user";

  const id = searchParams.get("id");
  const [data, setData] = useState<Request | null>(null);
  const [feedbackDialog, setFeedbackDialog] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!id || !rawData?.length) return;

    const foundRow = rawData.find((row) => row[0] === id);
    if (foundRow) {
      const request: Request = {
        id: foundRow[0],
        email: foundRow[1],
        name: foundRow[2],
        reason: foundRow[3],
        startTime: foundRow[4],
        endTime: foundRow[5],
        dateRequest: foundRow[6],
        dateCreated: foundRow[7],
        status: foundRow[8],
        dateApprovedOrRejected: foundRow[9],
        otHours: foundRow[10],
        feedback: foundRow[11] || "",
        type: foundRow[12],
      };
      setData(request);
    } else {
      setData(null);
    }
  }, [id, rawData]);

  const handleAction = async (status: "Approved" | "Rejected") => {
    if (!data) return;

    const result = await updateRequestStatus({
      requestId: data.id,
      status,
      feedback: status === "Rejected" ? feedback : "",
    });

    if (result.success) {
      toast.success(`Request ${status}`);
      router.refresh();
      setFeedback("");
      setFeedbackDialog(false);
    } else {
      toast.error(result.error || "Something went wrong");
    }
  };

  if (!id) return <div className="p-6 text-red-600">Missing request ID.</div>;
  if (!data) return <div className="p-6 text-muted-foreground">No request found for ID {id}.</div>;

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="max-w-[1500px] mx-auto px-6 my-24 py-4">
        <h1 className="text-3xl font-bold mb-10 tracking-tight">Request Details – ID #{data.id}</h1>

        <div className="border border-border rounded-xl bg-muted/40 p-6">
          <h2 className="text-lg font-semibold mb-4 text-muted-foreground">Request Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[15px]">
            <Detail
              label="Name"
              value={data.name}
            />
            <Detail
              label="Email"
              value={data.email}
            />
            <Detail
              label="Type"
              value={data.type}
            />
            <Detail
              label="Status"
              value={data.status}
              valueClass={data.status === "Approved" ? "text-green-600" : data.status === "Rejected" ? "text-red-600" : "text-yellow-600"}
            />
            <Detail
              label="Start Time"
              value={data.startTime}
            />
            <Detail
              label="End Time"
              value={data.endTime}
            />
            <Detail
              label="OT Hours"
              value={data.otHours}
            />
            <Detail
              label="Date Requested"
              value={data.dateRequest}
            />
            <Detail
              label="Date Created"
              value={data.dateCreated}
            />
            <Detail
              label="Approval Date"
              value={data.dateApprovedOrRejected}
            />
          </div>
        </div>

        <div className="mt-8 border border-border rounded-xl bg-muted/30 p-6">
          <h2 className="text-lg font-semibold mb-2 text-muted-foreground">Reason</h2>
          <p className="text-[15px] leading-relaxed">{data.reason}</p>
        </div>

        {data.feedback && (
          <div className="mt-6 border border-border rounded-xl bg-muted/30 p-6">
            <h2 className="text-lg font-semibold mb-2 text-muted-foreground">Feedback</h2>
            <p className="text-[15px] leading-relaxed">{data.feedback}</p>
          </div>
        )}

        {role === "admin" && (
          <div className="mt-10 flex justify-end gap-3">
            <AlertDialog
              open={feedbackDialog}
              onOpenChange={setFeedbackDialog}
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="px-6 py-2"
                >
                  Reject
                </Button>
              </AlertDialogTrigger>
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
                  <AlertDialogCancel className="cursor-pointer  border-2 px-2 rounded-md">Cancel</AlertDialogCancel>
                  <Button
                    variant="destructive"
                    onClick={() => handleAction("Rejected")}
                  >
                    Confirm Reject
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              onClick={() => handleAction("Approved")}
              className="px-6 py-2 bg-green-700 hover:bg-green-800"
            >
              Approve
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value, valueClass = "" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`font-medium text-[15px] ${valueClass}`}>{value}</span>
    </div>
  );
}
