import { BackgroundBeams } from "@/components/ui/background-beams";
import FormSignIn from "./form-signin";
import SSOAuth from "../register/sso-auth";

const Page: React.FC = () => {
  return (
    <section className=" w-full h-screen flex justify-center items-center">
      <BackgroundBeams />
      <div className="w-full flex flex-col justify-center max-w-md -mt-10 ">
        <div className="flex flex-col custom-shadow bg-card z-10 rounded-lg p-8">
          <SSOAuth authType="login" />
          <FormSignIn />
        </div></div>
    </section>
  );
};
export default Page;
