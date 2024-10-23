"use client";

import { Zap } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "./ui/button";
import { useMessageContext } from "@/app/(app)/(receiver)/MessageProvider";
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
  chartData[0].total =  maxMessages - messageCount;
  const totalVisitors = maxMessages - messageCount;

  return (
    <Card className="flex flex-col">
      {/* <CardHeader className="items-center pb-0">
        <CardTitle>total Echos</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader> */}
      <CardContent className="flex flex-1 items-center pb-0 -mb-20">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
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
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Remaining Echos
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
              cornerRadius={1}
              fill="#fca311"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="collected"
              fill="#14213d"
              stackId="a"
              cornerRadius={1}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <Button
          variant="outline"
          size="sm"
          className=" z-[50]"
          onClick={() => alert("clicked")}
        >
          <Zap className="w-4 h-4 mr-2" />
          Upgrade now
        </Button>
        <div className="leading-none text-muted-foreground">
          Showing total echos for {username || "user not found"}
        </div>
      </CardFooter>
    </Card>
  );
}
