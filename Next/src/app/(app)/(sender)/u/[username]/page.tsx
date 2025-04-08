import { Card, CardContent } from "@/components/ui/card";
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
          <ClientPage username={username} />
      </section>
    </>
  );
};

export default Page;
