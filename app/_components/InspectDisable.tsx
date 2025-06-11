"use client";

import Script from "next/script";
import React, { useEffect } from "react";
import { toast } from "sonner"; // ✅ Import this

export default function InspectDisable() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).Toast = toast;
    }
  }, []);

  return (
    <>
      <Script
        id="disable-devtools"
        strategy="lazyOnload"
      >
        {`
          if (
            window.location.hostname !== 'localhost' &&
            window.location.hostname !== '127.0.0.1'
          ) {
            document.addEventListener('contextmenu', e => {
              e.preventDefault();
              window.Toast?.("Right-click is disabled.");
            });

            document.addEventListener('keydown', e => {
              if (
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) ||
                (e.ctrlKey && e.key === 'U')
              ) {
                e.preventDefault();
                window.Toast?.("Developer tools are disabled.");
              }
            });
          }
        `}
      </Script>
    </>
  );
}
