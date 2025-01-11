"use client";

import { useEffect, useState } from "react";
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
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

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

export default function RadarChartCategoriesCount() {
    const [chartData, setChartData] = useState<ChartDataItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/api/analytics/get-categories-count");
                const formattedData: ChartDataItem[] =
                    response.data?.categoryCounts?.map((item: any) => ({
                        category: item.category,
                        count: Number(item.count), // Convert count to number
                    })) || [];
                setChartData(formattedData);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to fetch category data. Please try again.",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [toast]);

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

    let maxCount = 0;
    chartData.forEach((item) => {
        if (item.count > maxCount) {
            maxCount = item.count;
        }
    });

    const highestCategories: ChartDataItem[] = [];
    chartData.forEach((item) => {
        if (item.count === maxCount) {
            highestCategories.push(item);
        }
    });

    return (
        <Card>
            <CardHeader className="items-center pb-0">
                <CardTitle>Radar Chart - Categories Count</CardTitle>
                <CardDescription>
                    Displaying category counts from user feedback.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="pb-0">
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
