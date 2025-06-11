import React from "react";
import Statistics from "../_components/Statistics";
import Welcome from "../_components/Welcome";
import Clock from "../_components/Clock";

export default function Home() {
  const date = new Date();
  const manilaDate = new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).format(date);
  return (
    <main className="w-full container flex mx-auto justify-center items-center flex-col gap-y-10 flex-1 text-foreground relative my-24">
      <Statistics />
      <Welcome />
      <Clock />
    </main>
  );
}
