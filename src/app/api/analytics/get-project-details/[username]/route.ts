import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  await dbConnect();
  try {
    const user = await UserModel.findOne(
      { username: params.username },
      { name: 1, _id: 0, messageCount: 1, maxMessages: 1 }
    );

    return new Response(
      JSON.stringify({
        success: true,
        messageCount: user?.messageCount,
        maxMessages: user?.maxMessages,
        userDetails: user,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: "Couldn't find user.", error }),
      { status: 500 }
    );
  }
}
