import { SquareBackdrop } from "../sign-up/page";
import SSOAuth from "../sign-up/sso-auth";
import FormSignIn from "./form-signin";
import { IAuthType } from "@/types/ApiResponse"

const Page: React.FC = () => {
  return (
    <section className=" w-full h-screen flex justify-center items-center">
      <SquareBackdrop />
      <div className="w-full flex flex-col justify-center max-w-md -mt-10 ">
        <div className="flex flex-col custom-shadow bg-[#1C1C1C] z-10 rounded-lg p-8 border border-white/20">
          <SSOAuth authType="login" />
          <FormSignIn />
        </div></div>
    </section>
  );
};
export default Page;
