import { db } from "@/db/db";
import { usersTable } from "@/db/models/user";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { emailQueue } from "@/workers/emailWorker";

export async function POST(request: Request) {
  try {
    const { name, username, email, password } = await request.json();

    const existingUserVerifiedByUsername = await db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.username, username), eq(usersTable.isVerified, true)))
      .limit(1);

    if (existingUserVerifiedByUsername.length > 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Username already taken." }),
        { status: 409 }
      );
    }

    const existingUserByEmail = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date(Date.now() + 3600000); // 1 hour from now
    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUserByEmail.length > 0) {
      if (existingUserByEmail[0].isVerified) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "User already exists with this email.",
          }),
          { status: 403 }
        );
      } else {
        await db
          .update(usersTable)
          .set({
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry: expiryDate,
          })
          .where(eq(usersTable.email, email));
      }
    } else {
      await db.insert(usersTable).values({
        name,
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        messageCount: 0,
      });
    }

    // Add email sending job to the queue
    await emailQueue.add("sendVerificationEmail", {
      email,
      username,
      verifyCode,
      expiryDate,
    });

    return new Response(
      JSON.stringify({ success: true, message: "User registered successfully." }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user.", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error registering user." }),
      { status: 500 }
    );
  }
}
