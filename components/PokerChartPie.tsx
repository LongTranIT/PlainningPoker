"use client";

import * as React from "react";
import { Cell, Label, Pie, PieChart, Sector } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import {
  chartConfig,
  nameOfPokerChartBarData,
  PokerChartData,
} from "@/model/chart";
import { useMemo } from "react";

export interface PokerChartPieProps {
  chartData: PokerChartData[];
}

export const PokerChartPie = ({ chartData }: PokerChartPieProps) => {
  const majorityVote = useMemo(() => {
    let majorityPoint = "";
    let majorityCount = 0;
    chartData.forEach((item) => {
      const value = Number(item.Count);
      if (Number.isFinite(value) && value > majorityCount) {
        majorityPoint = item.Point;
        majorityCount = value;
      }
    });
    const totalVotes = chartData.reduce(
      (acc, curr) => acc + Number(curr.Count),
      0
    );
    const majorityIndex = chartData.findIndex(
      (item) => item.Point === majorityPoint
    );
    return {
      Point: majorityPoint,
      Count: majorityCount,
      TotalVotes: totalVotes,
      Index: majorityIndex,
    };
  }, [chartData]);

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-square max-h-[250px] w-[200px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey={nameOfPokerChartBarData("Count")}
          nameKey={nameOfPokerChartBarData("Point")}
          innerRadius={60}
          strokeWidth={5}
          activeIndex={majorityVote.Index}
          animationBegin={0}
          animationDuration={600}
          activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
            <Sector {...props} outerRadius={outerRadius + 10} />
          )}
        >
          {chartData.map((entry, index) => {
            const cfg = chartConfig[entry.Point as keyof typeof chartConfig];
            return (
              <Cell
                key={`cell-${index}`}
                fill={cfg?.color ?? "var(--chart-1)"}
              />
            );
          })}
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
                      {majorityVote.Point || "-"}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      {(
                        (majorityVote.Count / majorityVote.TotalVotes) *
                        100
                      ).toFixed(2)}{" "}
                      %
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
};
