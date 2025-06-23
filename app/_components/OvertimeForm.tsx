"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { submitRequest } from "@/app/actions/submit-request";

export default function EveryForm() {
  const { data: session } = useSession();
  const [formType, setFormType] = useState<"OT" | "VL" | "SL" | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [open, setOpen] = useState(false);
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = async () => {
    if (formType === "OT" && !endTime) {
      toast.error("Please provide an end time.");
      return;
    }

    const res = await submitRequest({
      email: session?.user?.email ?? "",
      name: session?.user?.name ?? "",
      reason,
      startTime: formType === "OT" ? startTime : "", // ✅ Only submit 6:00 for OT
      endTime: formType === "OT" ? endTime : "", // ✅ Only include endTime for OT
      date: format(date!, "yyyy-MM-dd"),
      type: formType ?? "OT",
    });

    if (res.success) {
      toast.success("Form submitted!");
      setOpen(false);
      setReason("");
      setEndTime("");
      setDate(new Date());
      setFormType(null);
    } else {
      toast.error("Failed to submit form.");
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}
    >
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpen(true)}
          className="w-full px-4 py-2 text-start hover:bg-accent cursor-pointer"
        >
          Request Forms
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-[550px]">
        <AlertDialogHeader>
          <AlertDialogTitle>{formType ? `Fill up ${formType} Request` : "Select Request Type"}</AlertDialogTitle>
        </AlertDialogHeader>

        {!formType ? (
          <div className="grid grid-cols-3 gap-2">
            {(["OT", "VL", "SL"] as const).map((type) => (
              <Button
                key={type}
                variant="outline"
                onClick={() => setFormType(type)}
              >
                {type}
              </Button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {formType === "OT" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Start Time</label>
                  <Input
                    type="time"
                    value={startTime}
                    disabled
                    className="cursor-not-allowed bg-muted"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">End Time</label>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium">Reason</label>
              <Textarea
                placeholder="Enter your reason..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>
        )}

        <AlertDialogFooter className="pt-4">
          {formType ? (
            <Button
              variant="ghost"
              onClick={() => {
                setFormType(null);
                setStartTime("");
                setEndTime("");
                setReason("");
              }}
            >
              Back
            </Button>
          ) : (
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          )}

          {formType && (
            <Button
              onClick={handleSubmit}
              disabled={!reason || (formType === "OT" && !endTime)}
            >
              Submit
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
