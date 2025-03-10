import { BackgroundBeams } from "@/components/ui/background-beams";
import ClientPage from "./client-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collect Feedback",
  description: "Collecting feedback to be analysed with AI.",
};

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const username = (await params).username;
  
  return (
    <>
      <section className=" w-full h-screen flex justify-center items-center">
        <BackgroundBeams />
        <div className="w-full flex flex-col justify-center max-w-md -mt-10 ">
          <div className="flex flex-col custom-shadow bg-[#1C1C1C] z-10 rounded-lg p-8 border border-white/20">
            <ClientPage username={username} />
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
