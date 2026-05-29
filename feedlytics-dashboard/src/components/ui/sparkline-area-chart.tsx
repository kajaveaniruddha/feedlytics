"use client";

import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type SparklineAreaChartProps = {
  values: number[];
  className?: string;
  width?: number;
  height?: number;
};

/** In viewBox units — lifts curve and fill above the card edge without growing the container. */
const BOTTOM_PADDING = 28;
const TOP_PADDING = 10;

function mapPoints(values: number[], width: number, height: number): Array<{ x: number; y: number }> {
  const chartHeight = height - BOTTOM_PADDING - TOP_PADDING;
  const baselineY = height - BOTTOM_PADDING;

  if (values.length === 0) {
    return [
      { x: 0, y: baselineY },
      { x: width, y: baselineY },
    ];
  }

  const max = Math.max(...values, 1);
  const stepX = values.length > 1 ? width / (values.length - 1) : 0;

  return values.map((value, index) => {
    const x = values.length > 1 ? index * stepX : width / 2;
    const normalized = value / max;
    const y = baselineY - normalized * chartHeight;
    return { x, y };
  });
}

/** Smooth cubic-bezier path through points (Catmull-Rom style control points). */
function buildSmoothLinePath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return "";
  if (points.length === 1) {
    const point = points[0];
    return `M ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  }

  let path = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const point0 = points[index - 1] ?? points[index];
    const point1 = points[index];
    const point2 = points[index + 1];
    const point3 = points[index + 2] ?? point2;

    const control1X = point1.x + (point2.x - point0.x) / 6;
    const control1Y = point1.y + (point2.y - point0.y) / 6;
    const control2X = point2.x - (point3.x - point1.x) / 6;
    const control2Y = point2.y - (point3.y - point1.y) / 6;

    path += ` C ${control1X.toFixed(2)} ${control1Y.toFixed(2)}, ${control2X.toFixed(2)} ${control2Y.toFixed(2)}, ${point2.x.toFixed(2)} ${point2.y.toFixed(2)}`;
  }

  return path;
}

function buildSparklinePaths(values: number[], width: number, height: number): {
  linePath: string;
  areaPath: string;
} {
  const baselineY = height - BOTTOM_PADDING;
  const points = mapPoints(values, width, height);

  if (values.length === 0) {
    const flatLine = `M 0 ${baselineY.toFixed(2)} L ${width} ${baselineY.toFixed(2)}`;
    return {
      linePath: flatLine,
      areaPath: `${flatLine} L ${width} ${baselineY.toFixed(2)} L 0 ${baselineY.toFixed(2)} Z`,
    };
  }

  const linePath = buildSmoothLinePath(points);
  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  const areaPath = `${linePath} L ${lastPoint.x.toFixed(2)} ${baselineY.toFixed(2)} L ${firstPoint.x.toFixed(2)} ${baselineY.toFixed(2)} Z`;

  return { linePath, areaPath };
}

export function SparklineAreaChart({
  values,
  className,
  width = 240,
  height = 90,
}: SparklineAreaChartProps) {
  const gradientId = React.useId().replace(/:/g, "");
  const { linePath, areaPath } = buildSparklinePaths(values, width, height);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn("block h-full w-full", className)}
      role="img"
      aria-label="Feedback trend sparkline"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-brand-500, #422AFB)" stopOpacity="0.28" />
          <stop offset="55%" stopColor="var(--color-brand-500, #422AFB)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="var(--color-brand-500, #422AFB)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path
        d={linePath}
        fill="none"
        stroke="var(--color-brand-500, #422AFB)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
