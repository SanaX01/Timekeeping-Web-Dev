"use client";

import { signIn } from "next-auth/react";

export default function LoginButton() {
  return (
    <div className="w-full justify-center h-screen items-center flex flex-col gap-y-10">
      <h1 className="text-7xl text-center font-bold w-3/5">Welcome to the Web Developer Team Attendance Portal</h1>
      <button
        className="cursor-pointer flex items-center justify-center w-fit px-5 h-12 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
        onClick={() => signIn("google")}
      >
        Sign in with Google
      </button>
    </div>
  );
}
