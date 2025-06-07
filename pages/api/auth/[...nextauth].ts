// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import authOptions from "../../../lib/auth";

export default NextAuth(authOptions); // ✅ this must be a default function
