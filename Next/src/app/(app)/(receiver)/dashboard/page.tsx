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
  { loading: () => <Skeleton className="w-full h-[300px] rounded-xl" /> }
);

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const Page = () => {
  const { session, userInfo } = useMessageContext();

  if (!session || !session.user) {
    return (
      <div className="flex justify-center items-center h-screen text-muted-foreground">
        Please Login to access Feedlytics
      </div>
    );
  }

  const username = session.user.username;

  return (
    <motion.section
      variants={stagger}
      initial="hidden"
      animate="show"
      className="w-full min-h-screen mx-auto p-4 lg:p-8 space-y-6"
    >
      <motion.div variants={fadeUp}>
        <WelcomeSection name={userInfo.name} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left column — wider */}
        <motion.div variants={fadeUp} className="lg:col-span-3">
          <FeedbackSettings username={username} />
        </motion.div>

        {/* Right column */}
        <motion.div variants={fadeUp} className="lg:col-span-2 space-y-6">
          <TotalMessagesPieChart username={username} />
          <FeedbackLink />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default React.memo(Page);
