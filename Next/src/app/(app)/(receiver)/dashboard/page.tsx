"use client";

import React from "react";
import { WelcomeSection } from "@/components/custom/welcome-section";
import { FeedbackSettings } from "@/components/custom/feedback-settings";
import { useMessageContext } from "@/context/MessageProvider";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { FeedbackLink } from "@/components/custom/feedback-link";

const TotalMessagesPieChart = dynamic(
  () => import("@/components/custom/total-messages-pie-chart"),
  { loading: () => <Skeleton className="w-full h-[300px] bg-[#333333]" /> }
);

const Page = () => {
  const { session } = useMessageContext();

  if (!session || !session.user) {
    return (
      <div className="flex justify-center items-center h-screen">
        Please Login to access Feedlytics
      </div>
    );
  }

  const username = session.user.username;

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-screen mx-auto space-y-8 p-8 relative"
    >
      <WelcomeSection username={username} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <FeedbackSettings username={username} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <TotalMessagesPieChart username={username} />
        </motion.div>
      </div>
      <FeedbackLink />
    </motion.section>
  );
};

export default React.memo(Page);

