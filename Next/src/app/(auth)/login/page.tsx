import { BackgroundBeams } from "@/components/ui/background-beams";
import FormSignIn from "./form-signin";
import SSOAuth from "../register/sso-auth";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const Page: React.FC = () => {
  return (
    <section className=" w-full h-screen flex justify-center items-center">
      {/* <BackgroundBeams /> */}
      <div className="w-full flex flex-col justify-center max-w-md -mt-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-8 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <div className="flex flex-col custom-shadow bg-card z-10 rounded-lg p-8">
          <SSOAuth authType="login" />
          <FormSignIn />
        </div>
      </div>
    </section>
  );
};
export default Page;
