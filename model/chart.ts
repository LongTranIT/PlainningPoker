import { ChartConfig } from "@/components/ui/chart";
import { nameOfFactory } from "@/lib/utils";

export const chartConfig = {
  "0": { label: "0", color: "var(--chart-0)" },
  "1": { label: "1", color: "var(--chart-1)" },
  "2": { label: "2", color: "var(--chart-2)" },
  "3": { label: "3", color: "var(--chart-3)" },
  "5": { label: "5", color: "var(--chart-4)" },
  "8": { label: "8", color: "var(--chart-5)" },
  "13": { label: "13", color: "var(--chart-6)" },
  "21": { label: "21", color: "var(--chart-7)" },
  "☕": { label: "☕", color: "var(--chart-8)" },
} satisfies ChartConfig;

export type PokerChartData = {
  Point: string;
  Count: number;
};

export const nameOfPokerChartBarData = nameOfFactory<PokerChartData>();
