import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 👇 Replace this with your real backend API endpoint
        const res = await fetch(`${process.env.BACKEND_API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        const user = await res.json();

        if (!res.ok) throw new Error(user.message || "Invalid credentials");

        // ✅ Return user object to store in session
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin", // Optional custom page
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
