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
    if (user.messageCount >= user.maxMessages) {
      return Response.json(
        {
          success: false,
          message: `${username} has reached his feedback limit.`,
        },
        { status: 400 }
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
    // const feedbacks = [
    //   {
    //     stars: 5,
    //     content: "Absolutely loved it! Highly recommend.",
    //   },
    //   {
    //     stars: 2,
    //     content: "It was okay, but there are better options.",
    //   },
    //   {
    //     stars: 4,
    //     content: "Great experience overall, would use again.",
    //   },
    //   {
    //     stars: 1,
    //     content: "Not what I expected, very disappointing.",
    //   },
    //   {
    //     stars: 3,
    //     content: "It was decent, but I had some issues.",
    //   },
    // ];
    // [...Array(50)].map((_, j) =>
    //   feedbacks.forEach((fb) => {
    //     user.message.push(fb as Message);
    //     user.messageCount += 1;
    //   })
    // );
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
