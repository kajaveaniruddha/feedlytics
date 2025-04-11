"use client";

import React from "react";
import { WelcomeSection } from "@/components/custom/welcome-section";
import { FeedbackSettings } from "@/components/custom/feedback-settings";
import { useMessageContext } from "@/hooks/use-message-context";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { FeedbackLink } from "@/components/custom/feedback-link";

const TotalMessagesPieChart = dynamic(
  () => import("@/components/custom/total-messages-pie-chart"),
  { loading: () => <Skeleton className="w-full h-[300px] bg-[hsl(var(--foreground))]" /> }
);

const Page = () => {
  const { session, name } = useMessageContext();

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
      className="w-full min-h-screen mx-auto space-y-8 p-4 lg:p-8"
    >
      <WelcomeSection name={name} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
          className=" space-y-6"
        >
          <TotalMessagesPieChart username={username} />
          <FeedbackLink />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default React.memo(Page);

