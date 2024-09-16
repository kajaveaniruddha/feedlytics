import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function PUT(request: Request) {
  await dbConnect();
  
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !user) {
    return new Response(
      JSON.stringify({ success: false, message: "Not Authenticated." }),
      { status: 401 }
    );
  }

  try {
    const { introduction, questions } = await request.json();

    const updatedUser = await UserModel.updateOne(
      { username: user.username },
      { $set: { introduction, questions } }
    );

    if (updatedUser.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Update failed due to some error." }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "User updated successfully.",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: "Couldn't update user.", error }),
      { status: 500 }
    );
  }
}
