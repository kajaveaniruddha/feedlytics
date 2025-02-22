"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { useMessageContext } from "@/context/MessageProvider";
import { ChartBar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"; // Example skeleton component for loading

const chartConfig = {
  visitors: {
    label: "Ratings",
  },
  "5star": {
    label: "5-star",
    color: "#619b8a",
  },
  "4star": {
    label: "4-star",
    color: "#a1c181",
  },
  "3star": {
    label: "3-star",
    color: "#fcca46",
  },
  "2star": {
    label: "2-star",
    color: "#fe7f2d",
  },
  "1star": {
    label: "1-star",
    color: "#3b5463",
  },
} satisfies ChartConfig;

export default function BarChartRatings() {
  const [isLoading, setIsLoading] = useState(true); // Initial loading state
  const { toast } = useToast();
  const [ratingsObject, setRatingsObject] = useState({
    "1star": 0,
    "2star": 0,
    "3star": 0,
    "4star": 0,
    "5star": 0,
  });

  const fetchRatings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/get-ratings");
      const ratingsData = res.data.ratings.reduce((acc: any, item: any) => {
        acc[item.stars] = (acc[item.stars] || 0) + 1;
        return acc;
      }, {});

      setRatingsObject({
        "1star": ratingsData["1star"] || 0,
        "2star": ratingsData["2star"] || 0,
        "3star": ratingsData["3star"] || 0,
        "4star": ratingsData["4star"] || 0,
        "5star": ratingsData["5star"] || 0,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  const chartData = [
    { rating: "5star", visitors: ratingsObject["5star"], fill: chartConfig["5star"].color },
    { rating: "4star", visitors: ratingsObject["4star"], fill: chartConfig["4star"].color },
    { rating: "3star", visitors: ratingsObject["3star"], fill: chartConfig["3star"].color },
    { rating: "2star", visitors: ratingsObject["2star"], fill: chartConfig["2star"].color },
    { rating: "1star", visitors: ratingsObject["1star"], fill: chartConfig["1star"].color },
  ];

  const totalRatings =
    ratingsObject["1star"] +
    ratingsObject["2star"] +
    ratingsObject["3star"] +
    ratingsObject["4star"] +
    ratingsObject["5star"];
  const averageRating =
    totalRatings > 0
      ? (
        (1 * ratingsObject["1star"] +
          2 * ratingsObject["2star"] +
          3 * ratingsObject["3star"] +
          4 * ratingsObject["4star"] +
          5 * ratingsObject["5star"]) /
        totalRatings
      ).toFixed(2)
      : "N/A";

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="items-center pb-0">
          <CardTitle>Loading Ratings...</CardTitle>
          <CardDescription>Please wait while we load your data.</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="items-center pb-0 ">
        <CardTitle>Ratings Distribution</CardTitle>
        <CardDescription>Distribution of ratings</CardDescription>
      </CardHeader>
      <CardContent className=" pb-0">
        <ChartContainer config={chartConfig} className=" p-6 pt-0 ">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, bottom: 20, left: 30, right: 30 }} // Adjust margin
          >
            <YAxis
              dataKey="rating"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <XAxis dataKey="visitors" type="number" hide />
            <CartesianGrid horizontal={false} />
            <Bar
              dataKey="visitors"
              layout="vertical"
              fill="#000"
              radius={5}
              barSize={50}
            >
              <LabelList
                dataKey="visitors"
                position="inside"
                className=" fill-foreground font-extrabold"
                fontSize={12}
              />
            </Bar>
          </BarChart>

        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 text-sm">
        <div className="flex gap-2 items-center">
          Average rating <ChartBar size={14} />
        </div>
        <div className="leading-none text-muted-foreground">
          Your current average rating is {averageRating}!
        </div>
      </CardFooter>
    </Card>
  );
}
