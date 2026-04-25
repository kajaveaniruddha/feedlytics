"use client";

import { motion } from "framer-motion";
import WorkflowsContent from "./_components/workflows-content";

export default function WorkflowsPage() {
  return (
    <motion.section
      className="container py-8 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      id="workflow-form"
    >
      <motion.h1
        className="text-3xl font-bold mb-4 text-primary"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Workflows
      </motion.h1>
      <motion.p
        className="text-secondary-foreground mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Manage your workflows to receive real-time feedback alerts directly in your selected groups.
      </motion.p>
      <WorkflowsContent />
    </motion.section>
  );
}
