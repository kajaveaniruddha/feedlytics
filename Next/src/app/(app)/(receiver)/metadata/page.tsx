"use client";

import React from "react";
import FormEditor from "./_components/form-editor";
import { motion } from "framer-motion";

const Page = () => {
  return (
    <motion.section
      className="container py-8 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-3xl font-bold mb-4 text-primary"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Form Editor
      </motion.h1>
      <motion.p
        className="text-secondary-foreground mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Customize how your feedback form looks and feels.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <FormEditor />
      </motion.div>
    </motion.section>
  );
};

export default Page;
