"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartCardProps {
  title: string;
  isLoading: boolean;
  children: React.ReactNode;
}

export function ChartCard({ title, isLoading, children }: ChartCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? <Skeleton className="h-[300px] w-full" /> : children}
      </CardContent>
    </Card>
  );
}
