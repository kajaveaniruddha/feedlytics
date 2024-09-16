"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const description = "An interactive pie chart"

const ratingData = [
  { rating: "5-star", visitors: 90, fill: "#619b8a" },   
  { rating: "4-star", visitors: 173, fill: "#a1c181" },   
  { rating: "3-star", visitors: 187, fill: "#fcca46" },  
  { rating: "2-star", visitors: 200, fill: "#fe7f2d" },  
  { rating: "1-star", visitors: 275, fill: "#233d4d" },  
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  "5-star": {
    label: "5-star",
    color: "#619b8a", 
  },
  "4-star": {
    label: "4-star",
    color: "#a1c181",
  },
  "3-star": {
    label: "3-star",
    color: "#fcca46",  
  },
  "2-star": {
    label: "2-star",
    color: "#fe7f2d",  
  },
  "1-star": {
    label: "1-star",
    color: "#233d4d",  
  },
} satisfies ChartConfig

export default function RadialRatingsChart() {
  const id = "pie-interactive"
  const [activeRating, setActiveRating] = React.useState(ratingData[0].rating)

  const activeIndex = React.useMemo(
    () => ratingData.findIndex((item) => item.rating === activeRating),
    [activeRating]
  )
  const ratings = React.useMemo(() => ratingData.map((item) => item.rating), [])

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Ratings Stats</CardTitle>
          <CardDescription>Star Ratings (1 to 5)</CardDescription>
        </div>
        <Select value={activeRating} onValueChange={setActiveRating}>
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select rating" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {ratings.map((key) => {
              const config = chartConfig[key as keyof typeof chartConfig]

              if (!config) {
                return null
              }

              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-sm"
                      style={{
                        backgroundColor:  `var(--color-${key})`,
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={ratingData}
              dataKey="visitors"
              nameKey="rating"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 20}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
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
                          {ratingData[activeIndex].visitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
