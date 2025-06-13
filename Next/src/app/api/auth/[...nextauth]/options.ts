import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { usersTable } from "@/db/models/user";
import { db } from "@/db/db";
import { or, eq } from "drizzle-orm";

interface ExtendedAuthOptions extends NextAuthOptions {
  trustHost?: boolean;
}

async function generateUniqueUsername(
  userId: string,
  provider: "github" | "google"
) {
  const username = provider + "_" + userId;
  return username;
}

export const authOptions: ExtendedAuthOptions = {
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
        const isPasswordCorrect = await bcrypt.compare(
          password,
          user[0].password!
        );

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
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  pages: { signIn: "/login" },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github" || account?.provider === "google") {
        try {
          const existingUser = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, user.email!))
            .limit(1);

          if (existingUser.length === 0) {
            const uniqueUsername = await generateUniqueUsername(
              account?.providerAccountId,
              account?.provider
            );

            // Create new user
            await db
              .insert(usersTable)
              .values({
                email: user.email!,
                name: user.name,
                avatarUrl: user.image,
                username: uniqueUsername,
                isVerified: true,
                password: "",
              })
              .onConflictDoNothing();
          }
          // Allow sign in for both new and existing users
          return true;
        } catch (error) {
          console.error("Error during provider sign in:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (token) {
        // Fetch latest user data from database
        const dbUser = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, session.user.email!))
          .limit(1);

        if (dbUser[0]) {
          session.user.id = dbUser[0].id.toString();
          session.user.username = dbUser[0].username;
          session.user.isAcceptingMessages = dbUser[0].isAcceptingMessage;
          session.user.isVerified = dbUser[0].isVerified;
        }
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        // For initial sign in
        token.id = user.id?.toString();
        token.username = user.username;
        token.isAcceptingMessage = user.isAcceptingMessages;
        token.isVerified = user.isVerified;
      } else if (
        account?.provider === "github" ||
        account?.provider === "google"
      ) {
        // For subsequent GitHub provider sessions, fetch fresh data
        const dbUser = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, token.email!))
          .limit(1);

        if (dbUser[0]) {
          token.id = dbUser[0].id.toString();
          token.username = dbUser[0].username;
          token.isAcceptingMessage = dbUser[0].isAcceptingMessage;
          token.isVerified = dbUser[0].isVerified;
        }
      }
      return token;
    },
  },
};
