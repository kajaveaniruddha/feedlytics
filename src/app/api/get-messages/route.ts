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
  // const limit = parseInt(url.searchParams.get("limit") || "10", 10);
  const limit = 10;
  const skip = (page - 1) * limit;

  const userId = new mongoose.Types.ObjectId(user?._id);

  try {
    const user = await UserModel.findById(userId);

    const users = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$message" },
      { $sort: { "message.createdAt": -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $group: {
          _id: "$_id",
          messages: { $push: "$message" },
        },
      },
    ]);

    if (!users || users.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          messageCount: user?.messageCount || 0,
          maxMessages: user?.maxMessages,
          message: [],
        }),
        {
          status: 200,
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        messageCount: user?.messageCount || 0,
        maxMessages: user?.maxMessages,
        messages: users[0].messages,
        currentPage: page,
        totalPages: Math.ceil((user?.messageCount || 0) / limit),
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
