import React from "react";
import { ColorToggle } from "./theme/color-toggle";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ModeToggle } from "./theme/mode-toggle";
import { quotes } from "./constants";

export default async function Footer() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  return (
    <div className="fixed bottom-0 flex flex-col w-full bg-background/95">
      <div className="flex justify-between items-end mb-2">
        <div className="text-xs ml-5 hidden md:flex">
          <blockquote>"{quote.q}"</blockquote>
        </div>
        <div className="text-xs mr-5  hidden md:block tracking-widest">Note: You must Time In before you can Time Out</div>
      </div>
      <footer className=" flex items-center justify-between p-4 w-full   border-t border-border  flex-col md:flex-row ">
        <div className="hidden md:flex items-center gap-2  md:flex-row ">
          <p>Switch Theme:</p>
          <ColorToggle />
        </div>
        <div className="flex justify-between items-center relative gap-4">
          <HoverCard>
            <HoverCardTrigger className="cursor-pointer">
              <span className="text-sm">Web Developer Team</span>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 pointer-events-none">
              <p className="text-sm">Kabataan ang pag-asa ng bayan.</p>
            </HoverCardContent>
          </HoverCard>
          <ModeToggle />
        </div>
      </footer>
    </div>
  );
}
