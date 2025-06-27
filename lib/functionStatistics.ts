export function getOvertimeToday(filteredData: string[][]): number {
  const today = new Date();
  const currentDateStr = today.toLocaleDateString("en-PH", {
    timeZone: "Asia/Manila",
  });

  const requiredDailyHours = 9;

  const todayRows = filteredData.filter((row) => {
    const dateStr = row[2].split(", ").slice(1).join(", ");
    const rowDate = new Date(dateStr);
    const rowDateStr = rowDate.toLocaleDateString("en-PH", {
      timeZone: "Asia/Manila",
    });

    return rowDateStr === currentDateStr;
  });

  const total = todayRows.reduce((sum, row) => {
    const timeInStr = row[3];
    const timeOutStr = row[4];
    if (!timeInStr || !timeOutStr) return sum;

    let timeIn = parseTimeToDateObject(timeInStr);
    const timeOut = parseTimeToDateObject(timeOutStr);

    const nineAm = new Date("1970-01-01T09:00:00");

    if (timeIn.getTime() < nineAm.getTime()) {
      timeIn = nineAm;
    }

    const diffMs = timeOut.getTime() - timeIn.getTime();
    const workedHours = diffMs / (1000 * 60 * 60);
    const overtime = workedHours - requiredDailyHours;

    return overtime > 0 ? sum + overtime : sum;
  }, 0);

  return parseFloat(total.toFixed(2));
}

export function convertTo24Hour(time12h: string): string {
  const [time, modifier] = time12h.toLowerCase().split(" ");
  let [hours, minutes] = time.split(":").map(Number);


  if (modifier === "pm" && hours !== 12) hours += 12;
  if (modifier === "am" && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;
}

export function parseTimeToDateObject(timeStr: string): Date {
  return new Date(`1970-01-01T${convertTo24Hour(timeStr)}`);
}

// --- Business Logic ---
export function getEarliestTimeInThisMonth(filteredData: string[][]) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const rowsThisMonth = filteredData.filter((row) => {
    const dateStr = row[2].split(", ").slice(1).join(", ");
    const date = new Date(dateStr);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  if (rowsThisMonth.length === 0) return null;

  const earliestRow = rowsThisMonth.reduce((earliest, current) => {
    const earliestTime = parseTimeToDateObject(earliest[3]);
    const currentTime = parseTimeToDateObject(current[3]);
    return currentTime < earliestTime ? current : earliest;
  });

  return {
    date: earliestRow[2],
    time: earliestRow[3],
  };
}

export function getTotalOvertimeThisMonth(filteredData: string[][]): number {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const endOfWorkDay = new Date("1970-01-01T18:00:00");

  const rowsThisMonth = filteredData.filter((row) => {
    const dateStr = row[2].split(", ").slice(1).join(", ");
    const date = new Date(dateStr);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const total = rowsThisMonth.reduce((sum, row) => {
    const timeOutStr = row[4];
    if (!timeOutStr) return sum;

    const timeOut = parseTimeToDateObject(timeOutStr);
    const diffMs = timeOut.getTime() - endOfWorkDay.getTime();

    if (diffMs <= 0) return sum;

    const hours = diffMs / (1000 * 60 * 60);
    return sum + hours;
  }, 0);

  return parseFloat(total.toFixed(2));
}
