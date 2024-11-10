"use client";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

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

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { session } = useMessageContext();
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
  }, []);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchRatings();
  }, [session]);

  // Update the chart data with dynamic values from props
  const chartData = [
    { rating: "5star", visitors: ratingsObject["5star"] , fill: chartConfig["5star"].color },
    { rating: "4star", visitors: ratingsObject["4star"] , fill: chartConfig["4star"].color },
    { rating: "3star", visitors: ratingsObject["3star"] , fill: chartConfig["3star"].color },
    { rating: "2star", visitors: ratingsObject["2star"] , fill: chartConfig["2star"].color },
    { rating: "1star", visitors: ratingsObject["1star"] , fill: chartConfig["1star"].color },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ratings Distribution</CardTitle>
        <CardDescription>Distribution of ratings</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="rating"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="visitors" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <CartesianGrid horizontal={false} />
            <Bar
              dataKey="visitors"
              layout="vertical"
              fill="#000"
              radius={5}
            >
              <LabelList
                dataKey="visitors"
                position="right"
                offset={10}
                className=" fill-foreground font-extrabold"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total ratings distribution.
        </div>
      </CardFooter> */}
    </Card>
  );
}
