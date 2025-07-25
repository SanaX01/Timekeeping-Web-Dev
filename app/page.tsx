"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function LoginButton() {
  return (
    <div className="w-full justify-center h-screen items-center flex flex-col gap-y-10">
      <h1 className="text-7xl text-center font-bold w-3/5">Welcome to the Web Developer Team Attendance Portal</h1>
      <div className="flex flex-wrap items-center gap-2 md:flex-row ">
        <Button
          onClick={() => signIn("google")}
          className="cursor-pointer px-5 h-12"
        >
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
