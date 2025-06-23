type LeaveBalanceModalProps = {
  leaveData: string[] | null;
};

export default function LeaveBalance({ leaveData }: LeaveBalanceModalProps) {
  return (
    <div className="flex w-full justify-center items-center absolute top-0">
      <div className="grid grid-cols-2 w-full gap-x-5">
        <div className=" grid grid-rows-2 gap-y-2">
          <div className="text-center">Remaining Balance</div>
          <ul className="text-sm text-muted-foreground grid grid-cols-2 w-full gap-x-3">
            <li className="grid grid-cols-2 text-center border-x border-t border-primary rounded-t-lg pt-2 px-2">
              <p>Vaction Leave</p>
              <p>{leaveData ? leaveData[1] : ""}</p>
            </li>
            <li className="grid grid-cols-2 text-center border-x border-t border-primary rounded-t-lg pt-2 px-2">
              <p>Sick Leave</p>
              <p>{leaveData ? leaveData[2] : ""}</p>
            </li>
          </ul>
        </div>
        <div className=" grid grid-rows-2 gap-y-2">
          <div className="text-center">Used Credit Leave</div>
          <ul className="text-sm text-muted-foreground grid grid-cols-3 w-full gap-x-3">
            <li className="grid grid-cols-2 text-center border-x border-t border-primary rounded-t-lg pt-2 px-2">
              <p>Vaction Leave</p>
              <p>{leaveData ? leaveData[3] : ""}</p>
            </li>
            <li className="grid grid-cols-2 text-center border-x border-t border-primary rounded-t-lg pt-2 px-2">
              <p>Sick Leave</p>
              <p>{leaveData ? leaveData[4] : ""}</p>
            </li>
            <li className="grid grid-cols-2 text-center border-x border-t border-primary rounded-t-lg pt-2 px-2">
              <p>Unpaid Leave</p>
              <p>{leaveData ? leaveData[5] : ""}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
