"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  chartConfig,
  nameOfPokerChartBarData,
  PokerChartData,
} from "@/model/chart";

export interface PokerChartBarProps {
  chartData: PokerChartData[];
}

export const PokerChartBar = ({ chartData }: PokerChartBarProps) => {
  return (
    <ChartContainer
      config={chartConfig}
      style={{ minHeight: 200, width: chartData.length * 50 }}
    >
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 20,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={nameOfPokerChartBarData("Point")}
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey={nameOfPokerChartBarData("Count")} radius={8}>
          {chartData.map((entry, index) => {
            const cfg = chartConfig[entry.Point as keyof typeof chartConfig];
            return (
              <Cell
                key={`cell-${index}`}
                fill={cfg?.color ?? "var(--chart-1)"}
              />
            );
          })}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};
