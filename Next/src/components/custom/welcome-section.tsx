"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export const WelcomeSection = React.memo(({ name }: { name: string }) => (
  <div className="space-y-1">
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-2"
    >
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
        Welcome back <span className="text-primary">{name}</span>
      </h1>
      <Sparkles className="w-5 h-5 text-primary shrink-0" />
    </motion.div>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="text-sm text-muted-foreground"
    >
      Here&apos;s your feedback overview and quick actions.
    </motion.p>
  </div>
));

WelcomeSection.displayName = "WelcomeSection";
