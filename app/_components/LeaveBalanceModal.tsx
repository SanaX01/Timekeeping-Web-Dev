// components/LeaveBalanceModal.tsx
"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type LeaveBalanceModalProps = {
  leaveData: string[] | null;
};

export default function LeaveBalanceModal({ leaveData }: LeaveBalanceModalProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full px-4 py-2 text-start hover:bg-accent cursor-pointer"
        >
          View Leave Balance
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md border-y-primary">
        <AlertDialogHeader>
          <AlertDialogTitle>Your Leave Balance</AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">Overview of your current leave credits.</AlertDialogDescription>
        </AlertDialogHeader>

        {!leaveData ? (
          <div className="text-sm text-red-500">No leave data available.</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 w-full">
            <div>
              <h3 className="font-semibold text-lg">Remaining Balance</h3>
              <div className="text-sm grid grid-rows-3">
                <li>VL: {leaveData[1]}</li>
                <li>SL: {leaveData[2]}</li>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Used Credit Leave</h3>
              <div className="text-sm grid grid-rows-3">
                <li>VL: {leaveData[3]}</li>
                <li>SL: {leaveData[4]}</li>
                <li>UPL: {leaveData[5]}</li>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end pt-4">
          <AlertDialogCancel asChild>
            <Button variant="outline">Close</Button>
          </AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
