import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  const { username, stars, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }
    if (!user.isAcceptingMessage) {
      return Response.json(
        { success: false, message: `${username} not accepting messages.` },
        { status: 403 }
      );
    }
    const newMessage = { stars, content, createdAt: new Date() };
    if (!content || content.length <= 10) {
      return Response.json(
        { success: false, message: "Message too small." },
        { status: 400 }
      );
    }
    if (content.length > 400) {
      return Response.json(
        { success: false, message: "Message too large." },
        { status: 400 }
      );
    }

    user.message.push(newMessage as Message);
    user.messageCount += 1;
    await user.save();
    return Response.json(
      {
        success: true,
        messageCount: user.messageCount,
        message: "Feedback sent successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Internal server error.", error },
      { status: 500 }
    );
  }
}
