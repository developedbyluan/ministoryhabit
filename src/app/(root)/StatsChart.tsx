"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Card } from "@/components/ui/card";
import { formatTime } from "@/utils/continue-studying";

export function StatsChart({
  data,
}: {
  data: { date: string; total_time: number }[];
}) {
  return (
    <Card className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis
            dataKey="date"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${Math.floor(value / 60)}m`}
          />
          <Tooltip
            formatter={(value: number) => formatTime(value)}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Bar
            dataKey="total_time"
            fill="currentColor"
            radius={[4, 4, 0, 0]}
            className="fill-primary"
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
