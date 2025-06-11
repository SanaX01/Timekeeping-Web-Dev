import React from "react";
import { ColorToggle } from "./theme/color-toggle";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ModeToggle } from "./theme/mode-toggle";
import { holidays } from "./constants";
import { Button } from "@/components/ui/button";

function getTodayHoliday() {
  const today = new Date();

  const day = parseInt(today.toLocaleString("en-PH", { day: "numeric", timeZone: "Asia/Manila" }));

  const month = today.toLocaleString("en-PH", {
    month: "long",
    timeZone: "Asia/Manila",
  });

  const formattedDate = `${day}${getDaySuffix(day)} ${month}`;

  return holidays.find((holiday) => holiday.date === formattedDate);
}

function getDaySuffix(day: number) {
  if (day >= 11 && day <= 13) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

export default async function Footer() {
  const holiday = getTodayHoliday();

  return (
    <div className="fixed bottom-0 flex flex-col w-full bg-background/95">
      <div className="flex justify-between items-end my-1.5">
        <div className="text-xs ml-5 hidden md:flex">
          {holiday ? (
            <p>
              🎉 Today is <strong>{holiday.name}</strong> ({holiday.type})
            </p>
          ) : (
            <p>📅 No holiday today.</p>
          )}
        </div>
        <em className="text-xs mr-5  hidden md:block tracking-wider font-light">Note: You must Time In before you can Time Out</em>
      </div>
      <footer className=" flex items-center justify-between p-4 w-full   border-t border-border  flex-col md:flex-row ">
        <div className="hidden md:flex items-center gap-2  md:flex-row ">
          <p>Switch Theme:</p>
          <ColorToggle />
        </div>
        <div className="flex justify-between items-center relative gap-4">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                variant="link"
                className="text-sm text-foreground"
              >
                Web Developer Team
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 pointer-events-none">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">Debugging</h4>
                <p className="text-sm">[ de-bugh-ing ] -verb</p>
                <div className="text-muted-foreground text-xs">1. being the detective in a crime movie where you are also the murderer.</div>
              </div>
            </HoverCardContent>
          </HoverCard>
          <ModeToggle />
        </div>
      </footer>
    </div>
  );
}
