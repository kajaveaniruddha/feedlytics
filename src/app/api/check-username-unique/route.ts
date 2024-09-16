import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({ username: usernameValidation });

export async function GET(request: Request) {
  await dbConnect();
  try {
    // localhost:300/api/check-username-unique?username=ani?phone=9605064691
    const { searchParams } = new URL(request.url);
    const queryParam = { username: searchParams.get("username") };
    // validate with zod
    const result = UsernameQuerySchema.safeParse(queryParam);
    if (!result.success) {
      const userNameErrors = result.error.format().username?._errors || [];
      return Response.json(
        { success: false, message: "Invalid query parameter." },
        { status: 400 }
      );
    }
    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUser) {
      return Response.json(
        { success: false, message: "Username is already taken." },
        { status: 200 }
      );
    }
    return Response.json(
        { success: true, message: "Username is unique" },
        { status: 200 }
      );
  } catch (error) {
    console.error("Error checking username", error);
    return Response.json(
      { success: false, message: "Error checking username" },
      { status: 500 }
    );
  }
}
