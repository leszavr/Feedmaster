"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartTooltip,
  ChartTooltipContent,
  ChartContainer,
} from "@/components/ui/chart";

const chartData = [
  { date: "2024-07-15", approved: 86, rejected: 45 },
  { date: "2024-07-16", approved: 102, rejected: 30 },
  { date: "2024-07-17", approved: 95, rejected: 25 },
  { date: "2024-07-18", approved: 110, rejected: 35 },
  { date: "2024-07-19", approved: 78, rejected: 18 },
  { date: "2024-07-20", approved: 123, rejected: 40 },
  { date: "2024-07-21", approved: 130, rejected: 22 },
];

const chartConfig = {
  approved: {
    label: "Approved",
    color: "hsl(var(--chart-1))",
  },
  rejected: {
    label: "Rejected",
    color: "hsl(var(--destructive))",
  },
};

export function PostsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Moderation Activity</CardTitle>
        <CardDescription>Approved vs. Rejected Posts (Last 7 Days)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 20 }}>
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar
                dataKey="approved"
                fill="var(--color-approved)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="rejected"
                fill="var(--color-rejected)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
