import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Table } from 'lucide-react';

export const FeedbackLink: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="flex justify-center"
    >
      <Link href="/feedbacks" passHref>
        <motion.div
          className="bg-primary-foreground rounded-full text-white px-6 py-4 flex items-center justify-center custom-shadow transition-all duration-300 cursor-pointer w-full max-w-md"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Table className="w-6 h-6 mr-3 text-primary" />
          <span className="text-md font-light">Go to Feedbacks Table</span>
        </motion.div>
      </Link>
    </motion.div>
  );
};
