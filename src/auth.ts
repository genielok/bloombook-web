import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import Google from "next-auth/providers/google";

// import bcrypt from "bcrypt";
// import postgres from "postgres";

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// ...

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [Google],
});
