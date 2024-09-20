import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
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

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const rating = parseInt(url.searchParams.get("rating") || "0", 10);
  const limit = 10;
  const skip = (page - 1) * limit;

  const userId = new mongoose.Types.ObjectId(user?._id);

  try {
    const user = await UserModel.findById(userId);
    const matchCondition: any = { _id: userId };

    const users = await UserModel.aggregate([
      { $match: matchCondition },
      { $unwind: "$message" },
      ...(rating > 0 && rating <= 5
        ? [{ $match: { "message.stars": rating } }]
        : []),
      { $sort: { "message.createdAt": -1 } },
      {
        $group: {
          _id: "$_id",
          messages: { $push: "$message" },
        },
      },
    ]);
    
    // Second aggregation query: Get total count of messages
    const totalCountResult = await UserModel.aggregate([
      { $match: matchCondition },
      { $unwind: "$message" },
      ...(rating > 0 && rating <= 5
        ? [{ $match: { "message.stars": rating } }]
        : []),
      { $count: "totalMessages" },
    ]);
    // console.log(totalCountResult[0].totalMessages);

    if (!users || users.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          messageCount: user?.messageCount || 0,
          maxMessages: user?.maxMessages,
          messages: [],
        }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        messageCount: user?.messageCount || 0,
        maxMessages: user?.maxMessages,
        messages: users[0].messages,
        messagesFound: totalCountResult[0].totalMessages,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: "An error occurred.", error }),
      { status: 500 }
    );
  }
}
