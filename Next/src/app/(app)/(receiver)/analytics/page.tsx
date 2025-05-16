"use client"
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import BarChartRatings from "./bar-ratings-chart";
import PieChartMessageCount from "./pie-chart-message-count";
import PieChartMessageSentimentAnalysis from "./pie-chart-message-sentiment-analysis";
import RadarChartCategoriesCount from "./radar-chart-categories-count";
import { useEffect } from "react";

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
  const { toast } = useToast();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<AnalyticsData>({
    queryKey: ["analytics"],
    queryFn: async () => {
      const response = await axios.get("/api/get-analytics");
      if (!response.data.success) {
        throw new Error("Failed to fetch analytics data");
      }
      return response.data as AnalyticsData;
    },
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });

  // Show toast on error
  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: (error as Error)?.message || "Failed to fetch analytics data",
      });
    }
  }, [isError, error, toast]);

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
            messageCount={data?.userDetails?.messageCount || 0}
            maxMessages={data?.userDetails?.maxMessages || 0}
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

