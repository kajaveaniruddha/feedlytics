"use client";

import { motion } from "framer-motion";
import SettingsContent from "./_components/settings-content";

export default function SettingsPage() {
  return (
    <motion.div
      className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <SettingsContent />
    </motion.div>
  );
}
