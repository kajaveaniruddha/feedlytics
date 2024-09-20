"use client";

import { TrendingUp } from "lucide-react";
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

type Props = {
  oneStar: number;
  twoStar: number;
  threeStar: number;
  fourStar: number;
  fiveStar: number;
};


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

export default function BarChartRatings({ oneStar, twoStar, threeStar, fourStar, fiveStar }: Props) {
  // Update the chart data with dynamic values from props
  const chartData = [
    { rating: "5star", visitors: fiveStar || 0, fill: chartConfig["5star"].color },
    { rating: "4star", visitors: fourStar || 0, fill: chartConfig["4star"].color },
    { rating: "3star", visitors: threeStar || 0, fill: chartConfig["3star"].color },
    { rating: "2star", visitors: twoStar || 0, fill: chartConfig["2star"].color },
    { rating: "1star", visitors: oneStar || 0, fill: chartConfig["1star"].color },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ratings Distribution</CardTitle>
        <CardDescription>Distribution of 1 to 5 star ratings</CardDescription>
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
