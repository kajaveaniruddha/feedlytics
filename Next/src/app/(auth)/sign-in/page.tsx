import { BackgroundBeams } from "@/components/ui/background-beams";
import SSOAuth from "../sign-up/sso-auth";
import FormSignIn from "./form-signin";

const Page: React.FC = () => {
  return (
    <section className=" w-full h-screen flex justify-center items-center">
      <BackgroundBeams />
      <div className="w-full flex flex-col justify-center max-w-md -mt-10 ">
        <div className="flex flex-col custom-shadow bg-[hsl(var(--auth-card-bg))] z-10 rounded-lg p-8">
          <SSOAuth authType="login" />
          <FormSignIn />
        </div></div>
    </section>
  );
};
export default Page;
