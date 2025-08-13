type LeaveBalanceModalProps = {
  leaveData: string[] | null;
};

export default function LeaveBalance({ leaveData }: LeaveBalanceModalProps) {
  return (
    <div className="flex w-full justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted-foreground w-full max-w-md">
        {/* Remaining Balance */}
        <div className="border border-primary rounded-md p-2">
          <p className="text-center font-medium mb-1">Remaining</p>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Vacation</span>
              <span>{leaveData?.[1] ?? "-"}</span>
            </div>
            <div className="flex justify-between">
              <span>Sick</span>
              <span>{leaveData?.[2] ?? "-"}</span>
            </div>
          </div>
        </div>

        {/* Used Credit Leave */}
        <div className="border border-primary rounded-md p-2">
          <p className="text-center font-medium mb-1">Used</p>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Vacation</span>
              <span>{leaveData?.[3] ?? "-"}</span>
            </div>
            <div className="flex justify-between">
              <span>Sick</span>
              <span>{leaveData?.[4] ?? "-"}</span>
            </div>
            <div className="flex justify-between">
              <span>Unpaid</span>
              <span>{leaveData?.[5] ?? "-"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
