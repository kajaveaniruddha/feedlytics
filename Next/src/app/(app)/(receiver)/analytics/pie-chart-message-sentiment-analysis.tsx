"use client"

import * as React from "react"
import axios from "axios"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useMessageContext } from "@/context/MessageProvider"
import { Skeleton } from "@/components/ui/skeleton"

export const description = "A donut chart representing sentiment analysis"

export default function PieChartMessageSentimentAnalysis() {
  const [chartData, setChartData] = React.useState([])
  const [totalMessages, setTotalMessages] = React.useState(0)
  const [isLoading, setLoading] = React.useState(true)
  const { session } = useMessageContext()
  const fetchSentiments = React.useCallback(() => {
    axios
      .get("/api/analytics/get-sentiments-count")
      .then((response) => {
        if (response.data.success) {
          const counts = response.data.counts
          const data = [
            {
              sentiment: "Positive",
              count: counts.positive || 0,
              fill: "hsl(var(--chart-1))",
            },
            {
              sentiment: "Negative",
              count: counts.negative || 0,
              fill: "hsl(var(--chart-2))",
            },
            {
              sentiment: "Neutral",
              count: counts.neutral || 0,
              fill: "hsl(var(--chart-3))",
            },
          ]

          setChartData(data as any)

          const total =
            (counts.positive || 0) +
            (counts.negative || 0) +
            (counts.neutral || 0)
          setTotalMessages(total)
        } else {
          console.error(response.data.message)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching sentiment counts:", error)
        setLoading(false)
      })
  }, [])

  React.useEffect(() => {
    if (!session || !session.user) return;
    fetchSentiments();
  }, [session, fetchSentiments]);
  const chartConfig = {
    Positive: {
      label: "Positive",
      color: "hsl(var(--chart-1))",
    },
    Negative: {
      label: "Negative",
      color: "hsl(var(--chart-2))",
    },
    Neutral: {
      label: "Neutral",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig
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
        <CardTitle>Sentiment Analysis</CardTitle>
        <CardDescription>Overall Sentiment Distribution</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="sentiment"
              innerRadius={60}
              strokeWidth={5}
              labelLine={false}
            >
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
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalMessages}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Messages
                        </tspan>
                      </text>
                    )
                  }
                  return null
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Total Messages: {totalMessages}
        </div>
        <div className="leading-none text-muted-foreground">
          Sentiment analysis of Feedbacks
        </div>
      </CardFooter>
    </Card>
  )
}
