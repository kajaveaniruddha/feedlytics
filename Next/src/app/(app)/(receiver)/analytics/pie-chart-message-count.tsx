"use client";

import { TrendingUp } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

export const description = "A radial chart with text";

const chartConfig = {
  collected: {
    label: "collected",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type Props = {
  messageCount: number;
  maxMessages: number;
  isLoading: boolean;
};

export default function PieChartMessageCount({ messageCount, maxMessages, isLoading }: Props) {
  const chartData = [{ collected: messageCount, fill: "var(--color-safari)" }];

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="items-center pb-0">
          <CardTitle>Loading Ratings...</CardTitle>
          <CardDescription>Please wait while we load your data.</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[18rem] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Feedback Collection Stats</CardTitle>
        <CardDescription>Keep collecting, keep improving!!</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={(messageCount / maxMessages) * 360}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="collected" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {chartData[0].collected?.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Echos collected
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          You have collected {messageCount} echos till now{" "}
          {messageCount === 0 ? <></> : <TrendingUp className="h-4 w-4" />}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing collected out of {maxMessages} available
        </div>
      </CardFooter>
    </Card>
  );
}
