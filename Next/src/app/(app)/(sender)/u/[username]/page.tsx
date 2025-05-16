import ClientPage from "./client-page";
import { Metadata } from "next";
import { TanstackProvider } from "@/context/tanstack-provider";

export const metadata: Metadata = {
  title: "Feedlytics | Collect Feedback",
  description: "Collecting feedback to be analysed with AI.",
};

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const username = (await params).username;

  return (
    <>
      <section className=" w-full h-screen flex justify-center items-center">
        <TanstackProvider>
          <ClientPage username={username} />
        </TanstackProvider>
      </section>
    </>
  );
};

export default Page;
