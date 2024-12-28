import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session?.user) {
    return new Response(
      JSON.stringify({ success: false, message: "Not Authenticated." }),
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user?._id);
  try {
    const user = await UserModel.findById(userId, {
      name: 1,
      _id: 0,
      messageCount: 1,
      maxMessages: 1,
    });
    // console.log(user)
    return new Response(
      JSON.stringify({
        success: true,
        messageCount: user?.messageCount,
        maxMessages: user?.maxMessages,
        userDetails: user,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: "Couldn't find user.", error }),
      { status: 500 }
    );
  }
}
