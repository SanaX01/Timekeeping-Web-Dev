import React from "react";
import Statistics from "../_components/Statistics";
import Welcome from "../_components/Welcome";

export default function Home() {
  return (
    <main className="w-full container flex mx-auto justify-center items-center flex-col gap-y-10 flex-1 text-foreground relative my-24">
      <Statistics />
      <Welcome />
    </main>
  );
}
