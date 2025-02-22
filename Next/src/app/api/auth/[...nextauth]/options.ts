import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github"; // New import
import bcrypt from "bcryptjs";
import { usersTable } from "@/db/models/user";
import { db } from "@/db/db";
import { or, eq } from "drizzle-orm";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        const { identifier, password } = credentials;

        // Find user by email or username
        const user = await db
          .select()
          .from(usersTable)
          .where(
            or(
              eq(usersTable.email, identifier),
              eq(usersTable.username, identifier)
            )
          )
          .limit(1);

        if (!user[0]) {
          throw new Error("No user found with the provided credentials.");
        }

        if (!user[0].isVerified) {
          throw new Error("Please verify your account before logging in.");
        }

        // Compare the provided password with the stored hashed password
        const isPasswordCorrect = await bcrypt.compare(password, user[0].password);

        if (!isPasswordCorrect) {
          throw new Error("Incorrect password.");
        }

        // Return user object without sensitive information
        const { password: _, ...userWithoutPassword } = user[0];
        return userWithoutPassword;
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!
    }) 
  ],
  pages: { signIn: "/sign-in" },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.isVerified = token.isVerified;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id?.toString();
        token.username = user.username;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.isVerified = user.isVerified;
      }
      return token;
    },
  },
};
