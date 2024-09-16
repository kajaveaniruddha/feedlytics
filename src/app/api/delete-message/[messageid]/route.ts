import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  const messageId = params.messageid;
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not Authenticated." },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user?._id);
  try {
    const updateResult = await UserModel.updateOne(
      { _id: userId },
      { $pull: { message: { _id: messageId } }, $inc: { messageCount: -1 } }
    );

    if (updateResult.modifiedCount === 0) {
      return Response.json(
        { success: false, message: "Message not found." },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Message deleted." },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Error deleting message.", error },
      { status: 500 }
    );
  }
}
