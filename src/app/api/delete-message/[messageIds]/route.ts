import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";

export async function DELETE(
  request: Request,
  { params }: { params: { messageIds: string } }
) {
  // Expecting messageIds as a comma-separated string in the URL
  const { messageIds } = params;
  console.log(messageIds)
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return new Response(
      JSON.stringify({ success: false, message: "Not Authenticated." }),
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    // Split messageIds by comma and convert each to ObjectId
    const objectIds = messageIds.split(',').map(id => new mongoose.Types.ObjectId(id));
    console.log("objectIds")
    const updateResult = await UserModel.updateOne(
      { _id: userId },
      { $pull: { message: { _id: { $in: objectIds } } }, $inc: { messageCount: -objectIds.length } }
    );

    if (updateResult.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Messages not found." }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Messages deleted." }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Error deleting messages.", error }),
      { status: 500 }
    );
  }
}
