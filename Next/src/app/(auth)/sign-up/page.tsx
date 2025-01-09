import { NextPage } from "next";
import DetailsSignup from "./details-signup";
import FormSignup from "./form-signup";
import SSOSignup from "./sso-signup";

const Page: NextPage = () => {

  return (
    <section className="min-h-screen flex justify-center">
      <DetailsSignup />
      <SquareBackdrop />
      <div className="w-full flex flex-col justify-center max-w-xl -mt-10 ">
        <div className="flex flex-col custom-shadow bg-[#1C1C1C] z-10 rounded-lg p-8 border border-white/20">
          <SSOSignup />
          <FormSignup />
        </div>
      </div>
    </section>
  );
};

export default Page;

function SquareBackdrop({ }) {
  return (<div className="z-0 absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>);
}