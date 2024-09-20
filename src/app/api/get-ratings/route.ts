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

  const userId = new mongoose.Types.ObjectId(user?._id);

  try {
    const ratingData = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$message" },
      {
        $project: {
          _id: 0,
          stars: "$message.stars",
          createdAt: { $dateToString: { format: "%Y-%m-%d", date: "$message.createdAt" } }
        }
      }
    ]);

    // Format the output
    const ratingsArray = ratingData.map(item => ({
      stars: `${item.stars}star`,
      createdAt: item.createdAt
    }));

    // console.log(ratingsArray);

    return new Response(
      JSON.stringify({ success: true, ratings: ratingsArray }),
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
