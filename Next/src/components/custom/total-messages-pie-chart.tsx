"use client";

import { Crown, Zap } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
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
import { Button } from "../ui/button";
import { useMessageContext } from "@/context/MessageProvider";
const chartData = [{ month: "january", total: 50, collected: 0 }];

const chartConfig = {
  total: {
    label: "remaining",
    color: "#fff346",
  },
  collected: {
    label: "collected",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

interface props {
  username: string | undefined;
}

export default function Component({
  username,
}: props) {
  const { messageCount, maxMessages } =
    useMessageContext();
  chartData[0].collected = messageCount;
  chartData[0].total = maxMessages - messageCount;
  const totalVisitors = maxMessages - messageCount;

  return (
    <Card className="flex flex-col w-full ">
      <CardHeader className="text-center space-y-1.5">
        <CardTitle className="text-2xl font-bold">Total Feedbacks</CardTitle>
        <CardDescription className="text-secondary font-medium">
          Current Plan: FREE
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 relative pt-4">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[14rem] -mb-20"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={85}
            outerRadius={140}
            barSize={20}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 20}
                          className="fill-[#C1F536] text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 8}
                          className="fill-secondary text-sm"
                        >
                          Remaining Feedbacks
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="total"
              stackId="a"
              cornerRadius={4}
              fill="#C1F536"
              className="stroke-transparent "
            />
            <RadialBar
              dataKey="collected"
              stackId="a"
              cornerRadius={4}
              fill="#c2f5364b"
              className="stroke-transparent"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-center gap-4 pb-6">
        <Button
          variant="default"
          size="lg"
          onClick={() => alert("Not Available Yet")}
          className=" z-20"
        >
          <Crown className="w-5 h-5 mr-2" />
          Upgrade to Pro
        </Button>
        <div className="text-sm text-zinc-400">
          Showing total feedbacks for{" "}
          <span className="text-white font-medium">
            {username || "user not found"}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
