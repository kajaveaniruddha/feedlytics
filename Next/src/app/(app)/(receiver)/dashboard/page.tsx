"use client";

import React from "react";
import { WelcomeSection } from "@/components/custom/welcome-section";
import { FeedbackSettings } from "@/components/custom/feedback-settings";
import { MessageAnalytics } from "@/components/custom/message-analytics";
import { useMessageContext } from "@/context/MessageProvider";
import MessageTable from "@/components/custom/table-box";

const Page = () => {
  const { session } = useMessageContext();

  if (!session || !session.user) {
    return (
      <div className="flex justify-center items-center">Please Login</div>
    );
  }

  const username = session.user.username;

  return (
    <section className="my-8 rounded max-w-7xl mx-auto">
      <WelcomeSection username={username} />
      <div className="flex gap-4 justify-around w-full mb-4 h-[250px] rounded-lg">
        <FeedbackSettings username={username} />
        <MessageAnalytics username={username} />
      </div>
      <MessageTable />
    </section>
  );
};

export default React.memo(Page);
