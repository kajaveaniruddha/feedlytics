import { NextPage } from "next";
import DetailsSignup from "./details-signup";
import FormSignup from "./form-signup";
import SSOAuth from "./sso-auth";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const Page: NextPage = () => {
  return (
    <section className="min-h-screen flex justify-center">
      <DetailsSignup />
      {/* <BackgroundBeams /> */}
      <div className="w-full flex flex-col justify-center max-w-xl -mt-10 ">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-8 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <div className="flex flex-col custom-shadow bg-card z-10 rounded-lg p-8 ">
          <SSOAuth authType="signup" />
          <FormSignup />
        </div>
      </div>
    </section>
  );
};

export default Page;
