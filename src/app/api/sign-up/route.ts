import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { emailQueue } from "@/workers/emailWorker";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { name, username, email, password } = await request.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
      return Response.json({
        success: false,
        message: "Username already taken.",
      });
    }
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date(Date.now() + 3600000); // 1 hour from now

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: "User already exists with this email." },
          { status: 500 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = expiryDate;
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({
        name,
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        messageCount: 0,
        message: [],
      });
      await newUser.save();
    }

    // Add email sending job to the queue
    await emailQueue.add("sendVerificationEmail", {
      email,
      username,
      verifyCode,
      expiryDate,
    });

    return Response.json(
      { success: true, message: "User registered successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error registering user.", error);
    return Response.json(
      { success: false, message: "Error registering user." },
      { status: 500 }
    );
  }
}
