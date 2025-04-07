"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from 'lucide-react';
import { Card } from "../ui/card";

export const WelcomeSection = React.memo(({ username }: { username: string }) => (
  <Card className="flex flex-col items-center justify-center py-12 ">
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <h1 className="text-4xl md:text-5xl font-bold pb-4 bg-gradient-to-r from-primary to-lime-400 bg-clip-text text-transparent">
        FeedLytics
      </h1>
      <h2 className="text-3xl md:text-4xl font-semibold mb-4 flex items-center justify-center ">
        <Sparkles className="w-6 h-6 mr-2 text-primary" />
        {username}
        <Sparkles className="w-6 h-6 ml-2 text-primary" />
      </h2>
    </motion.div>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="text-lg text-secondary-foreground max-w-lg text-center max-lg:px-2 "
    >
      Ready to check your latest feedback and insights with AI?
    </motion.p>
  </Card>
));

WelcomeSection.displayName = 'WelcomeSection';

