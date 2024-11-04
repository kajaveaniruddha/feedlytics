import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";
import axios from "axios";

const getSentiment = async (content: string) => {
  try {
    const response = await axios.post("http://127.0.0.1:8000/analyze", {
      reviews: [content],
    });
    // console.log(response)
    return response.data[0]?.overall_sentiment?.label;
  } catch (error) {
    console.error("Sentiment analysis failed:", error);
    return null;
  }
};

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
    //     sentiment: "",
    //   },
    //   {
    //     stars: 2,
    //     content: "It was okay, but there are better options.",
    //     sentiment: "",
    //   },
    //   {
    //     stars: 4,
    //     content: "Great experience overall, would use again.",
    //     sentiment: "",
    //   },
    //   {
    //     stars: 1,
    //     content: "Not what I expected, very disappointing.",
    //     sentiment: "",
    //   },
    //   {
    //     stars: 3,
    //     content: "It was decent, but I had some issues.",
    //     sentiment: "",
    //   },
    //   {
    //     stars: 4,
    //     content: "Great experience overall, but there’s room for improvement.",
    //     sentiment: "",
    //   },
    //   {
    //     stars: 3,
    //     content: "It was okay, nothing exceptional but not bad either.",
    //     sentiment: "",
    //   },
    //   {
    //     stars: 2,
    //     content: "Expected more. It didn’t meet my expectations.",
    //     sentiment: "",
    //   },
    //   {
    //     stars: 1,
    //     content: "Very disappointed. The quality was poor.",
    //     sentiment: "",
    //   },
    //   {
    //     stars: 5,
    //     content: "Amazing service! Exceeded my expectations.",
    //     sentiment: "",
    //   },
    //   {
    //     stars: 4,
    //     content: "Good quality, but delivery took longer than expected.",
    //     sentiment: "",
    //   },
    //   {
    //     stars: 3,
    //     content: "Average. It’s fine for the price but nothing special.",
    //     sentiment: "",
    //   },
    //   {
    //     stars: 1,
    //     content: "Terrible experience. I wouldn’t recommend this.",
    //     sentiment: "",
    //   },
    //   {
    //     stars: 5,
    //     content: "Fantastic product! Will definitely purchase again.",
    //     sentiment: "",
    //   },
    //   {
    //     stars: 2,
    //     content: "Not satisfied. It could be much better.",
    //     sentiment: "",
    //   },
    // ];
    // [...Array(2)].map((_, j) =>
    //   feedbacks.forEach(async (fb) => {
    //     fb.sentiment = await getSentiment(fb.content);
    //     user.message.push(fb as Message);
    //     user.messageCount += 1;
    //   })
    // );

    // Get sentiment analysis result

    const sentiment = await getSentiment(content);
    if (!sentiment) {
      return Response.json(
        { success: false, message: "Failed to analyze sentiment." },
        { status: 500 }
      );
    }

    const newMessage = {
      stars,
      content,
      sentiment,
      createdAt: new Date(),
    };
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
