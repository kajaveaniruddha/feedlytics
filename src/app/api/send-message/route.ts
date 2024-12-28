import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";
import { analyzeReview } from "./llm";

// POST handler
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
        { success: false, message: `${username} not accepting feedbacks.` },
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

    // Increment message count before processing
    user.messageCount += 1;
    await user.save();

    // Analyze sentiment and feedback classification
    const sentimentData = await analyzeReview(content);

    if (!sentimentData) {
      user.messageCount -= 1;
      await user.save();
      return Response.json(
        { success: false, message: "Failed to analyze sentiment." },
        { status: 500 }
      );
    }

    const { overall_sentiment: sentiment, feedback_classification: category } =
      sentimentData;

    const newMessage = {
      stars,
      content,
      sentiment,
      category,
      createdAt: new Date(),
    };
    user.message.push(newMessage as Message);
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
