"use client"
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import BarChartRatings from "./bar-ratings-chart";
import PieChartMessageCount from "./pie-chart-message-count";
import PieChartMessageSentimentAnalysis from "./pie-chart-message-sentiment-analysis";
import RadarChartCategoriesCount from "./radar-chart-categories-count";

type AnalyticsData = {
  userDetails: {
    name: string;
    messageCount: number;
    maxMessages: number;
  };
  categoryCounts: Array<{ category: string; count: number }>;
  sentimentCounts: {
    positive: number;
    negative: number;
    neutral: number;
  };
  ratingsCount: Array<{ rating: number; count: number }>;
};

const Page = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await axios.get("/api/get-analytics");
      if (response.data.success) {
        setData(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <motion.section
      className="container py-8 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-3xl md:text-4xl font-bold text-primary mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Dashboard Analytics
      </motion.h1>
      <motion.p
        className="text-secondary-foreground mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        View analytics for all your feedbacks here...
      </motion.p>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.2, duration: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <PieChartMessageCount
            messageCount={data?.userDetails.messageCount || 0}
            maxMessages={data?.userDetails.maxMessages || 0}
            isLoading={isLoading}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <PieChartMessageSentimentAnalysis
            sentimentCounts={data?.sentimentCounts}
            isLoading={isLoading}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <BarChartRatings
            isLoading={isLoading}
            ratingsCount={data?.ratingsCount}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <RadarChartCategoriesCount
            categoryCounts={data?.categoryCounts || []}
            isLoading={isLoading}
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default Page;

