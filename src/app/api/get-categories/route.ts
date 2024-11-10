import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";

interface SentimentCount {
  positive: number;
  negative: number;
  neutral: number;
}

interface AggregatedSentiment {
  _id: keyof SentimentCount;
  count: number;
}

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

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const sentimentCounts: AggregatedSentiment[] = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$message" },
      {
        $group: {
          _id: "$message.sentiment",
          count: { $sum: 1 },
        },
      },
    ]);

    const counts: SentimentCount = {
      positive: 0,
      negative: 0,
      neutral: 0,
    };

    sentimentCounts.forEach((item) => {
      counts[item._id] = item.count;
    });

    return new Response(JSON.stringify({ success: true, counts }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: "An error occurred." }),
      { status: 500 }
    );
  }
}
