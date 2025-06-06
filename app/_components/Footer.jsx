import React from "react";
import { ColorToggle } from "../_components/theme/color-toggle";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ModeToggle } from "../_components/theme/mode-toggle";
import { quotes } from "../_components/constants";

export default async function Footer() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex]; // ✅ stored in a variable

  return (
    <div className="absolute bottom-0 flex flex-col w-full">
      <div
        className="text-xs ml-5 my-5 hidden md:block"
        dangerouslySetInnerHTML={{ __html: quote.h }}
      ></div>
      <footer className=" flex items-center justify-between p-4 w-full  bg-background border-t border-border  flex-col md:flex-row ">
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
