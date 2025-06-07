// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies: process.env.NODE_ENV === "production",
  session: {
    strategy: "jwt", // <- ensure this
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) {
        token.role = ["grunting.jelly@auroramy.com", "jason.ruben@auroramy.com"].includes(user.email) ? "admin" : "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (!session.user) session.user = {};
      (session.user as any).role = token.role;
      return session;
    },
  },
};

export default authOptions;
