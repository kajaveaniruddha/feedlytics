import { NextPage } from "next";
import DetailsSignup from "./details-signup";
import FormSignup from "./form-signup";
import SSOAuth from "./sso-auth";
import { BackgroundBeams } from "@/components/ui/background-beams";

const Page: NextPage = () => {

  return (
    <section className="min-h-screen flex justify-center">
      <DetailsSignup />
      <BackgroundBeams />
      <div className="w-full flex flex-col justify-center max-w-xl -mt-10 ">
        <div className="flex flex-col custom-shadow bg-[#1C1C1C] z-10 rounded-lg p-8 border border-white/20">
          <SSOAuth authType = "signup" />
          <FormSignup />
        </div>
      </div>
    </section>
  );
};

export default Page;
