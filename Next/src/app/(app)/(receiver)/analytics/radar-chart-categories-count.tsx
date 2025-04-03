"use client";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

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
import { Skeleton } from "@/components/ui/skeleton";

type ChartDataItem = {
    category: string;
    count: number;
};

const chartConfig = {
    desktop: {
        label: "Category",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

type Props = {
    categoryCounts: Array<{ category: string; count: number }>;
    isLoading: boolean;
};

export default function RadarChartCategoriesCount({ categoryCounts, isLoading }: Props) {
    const chartData = categoryCounts;

    if (isLoading) {
        return (
            <Card>
                <CardHeader className="items-center pb-4">
                    <CardTitle>Loading Chart...</CardTitle>
                    <CardDescription>Please wait while the data is being fetched.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[400px] w-full" />
                </CardContent>
            </Card>
        );
    }

    const computedMaxCount = chartData.length ? Math.max(...chartData.map(item => Number(item.count))) : 0;
    const highestCategories = chartData.filter(item => Number(item.count) === computedMaxCount);

    return (
        <Card>
            <CardHeader className="items-center pb-0">
                <CardTitle>Radar Chart - Categories Count</CardTitle>
                <CardDescription>
                    Displaying category counts from user feedback.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="pb-0 max-w-xl">
                    <RadarChart data={chartData}>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <PolarGrid
                            className="fill-[--color-desktop] opacity-10"
                            gridType="circle"
                        />
                        <PolarAngleAxis dataKey="category" />
                        <Radar
                            dataKey="count"
                            fill="var(--color-desktop)"
                            fillOpacity={0.5}
                        />
                    </RadarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Highest feedback categories:
                </div>
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                    <ul className="flex gap-2">
                        {highestCategories.map((cat) => (
                            <li key={cat.category}>
                                {cat.category} ({cat.count} feedbacks)
                            </li>
                        ))}
                    </ul>
                </div>
            </CardFooter>
        </Card>
    );
}
