"use client";

import { useEffect, useState } from "react";
import { Crown } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
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
import { Button } from "@/components/ui/button";
import { useMessageContext } from "@/hooks/use-message-context";

const chartConfig = {
  total: {
    label: "remaining",
    color: "hsl(var(--chart-2))",
  },
  collected: {
    label: "collected",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

interface props {
  username: string | undefined;
}

export default function Component({ username }: props) {
  const { maxMessages, userInfo } = useMessageContext();
  const [periodCount, setPeriodCount] = useState(0);

  useEffect(() => {
    const fetchPeriodCount = async () => {
      try {
        const res = await api.getBilling();
        if (res.data?.periodFeedbackCount != null) {
          setPeriodCount(res.data.periodFeedbackCount);
        }
      } catch {
        // fallback: period count stays 0
      }
    };
    fetchPeriodCount();
  }, []);

  const remaining = Math.max(0, maxMessages - periodCount);
  const chartData = [{ month: "current", total: remaining, collected: periodCount }];

  const formattedEnd = userInfo.billingPeriodEnd
    ? new Date(userInfo.billingPeriodEnd).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  const tierLabel =
    userInfo.userTier.charAt(0).toUpperCase() + userInfo.userTier.slice(1);

  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="text-center space-y-1.5">
        <CardTitle className="text-2xl font-bold">Monthly Feedbacks</CardTitle>
        <CardDescription className="text-secondary-foreground font-medium">
          Current Plan:{" "}
          <span className="font-bold tracking-wide">{tierLabel}</span>
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
                          className="text-3xl font-bold fill-secondary-foreground"
                        >
                          {remaining.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 8}
                          className="fill-secondary-foreground text-xs"
                        >
                          remaining this month
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
              fill="hsl(var(--primary))"
              className="stroke-transparent"
            />
            <RadialBar
              dataKey="collected"
              stackId="a"
              cornerRadius={4}
              fill="hsl(var(--secondary-foreground))"
              className="stroke-transparent"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-center gap-4 pb-6">
        {userInfo.userTier !== "business" ? (
          <Link href="/settings" className="z-20">
            <Button variant="default" size="lg">
              <Crown className="w-5 h-5 mr-2" />
              Upgrade Plan
            </Button>
          </Link>
        ) : (
          <Button variant="default" size="lg" disabled>
            <Crown className="w-5 h-5 mr-2" />
            {tierLabel} Plan
          </Button>
        )}
        <div className="text-sm text-muted-foreground text-center">
          <span>
            {periodCount.toLocaleString()} of {maxMessages.toLocaleString()} used
            {username && (
              <> by <span className="font-medium text-foreground">{username}</span></>
            )}
          </span>
          {formattedEnd && (
            <span className="block text-xs mt-0.5">
              Resets on {formattedEnd}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
