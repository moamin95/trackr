"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { Transaction } from "@/types"
import { formatDate } from '@lib/utils'

const chartConfig = {
  income: {
    label: "Income",
    color: "var(--chart-income)",
  },
  expense: {
    label: "Expenses",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

type ChartData = {
  date: string;
  amount: number;
  income: number;
  expense: number;
}

export function ChartLineInteractive({ transactions, dates }: {
  transactions: Transaction[], dates: {
    initialDateFrom: Date;
    initialDateTo: Date | undefined;
  }
}) {
  // Transform transactions into chart data grouped by date
  const chartData = React.useMemo(() => {
    if (!transactions.length) return [];

    // Group transactions by date
    const grouped = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date).toISOString().split('T')[0];

      if (!acc[date]) {
        acc[date] = { date, amount: 0, income: 0, expense: 0 };
      }

      acc[date].amount += transaction.amount;

      if (transaction.amount > 0) {
        acc[date].income += transaction.amount;
      } else {
        acc[date].expense += Math.abs(transaction.amount);
      }

      return acc;
    }, {} as Record<string, ChartData>);

    // Convert to array and sort by date
    return Object.values(grouped).sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [transactions]);

  const totals = React.useMemo(
    () => ({
      amount: chartData.reduce((acc, curr) => acc + curr.amount, 0),
      income: chartData.reduce((acc, curr) => acc + curr.income, 0),
      expense: chartData.reduce((acc, curr) => acc + curr.expense, 0),
    }),
    [chartData]
  )

  if (!chartData.length) {
    return (
      <Card className="py-6">
        <CardHeader>
          <CardTitle>Transaction Trends</CardTitle>
          <CardDescription>No transaction data available</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className={`flex flex pt-0 min-h-[20vh] w-full backdrop-blur-xl bg-white/60 dark:bg-card/60 border border-gray-300/60 dark:border-white/20 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.1)] hover:shadow-[0px_12px_48px_0px_rgba(0,0,0,0.15)] transition-all duration-300 bg-gradient-to-br ${totals.income > totals.expense ? 'from-green-500/10 via-transparent to-green-500/5' : 'from-red-500/10 via-transparent to-red-500/5'}`}>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Transaction Trends for {`${formatDate(dates.initialDateFrom, "en-US")}${dates.initialDateTo != null
            ? " - " + formatDate(dates.initialDateTo, "en-US")
            : ""
            }`}</CardTitle>
          <CardDescription>
            Daily income and expenses over the selected period
          </CardDescription>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs">
              {chartConfig.income.label}
            </span>
            <span className="text-lg leading-none font-bold sm:text-2xl">
              ${totals.income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="h-12 w-px bg-border shrink-0" />
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs">
              {chartConfig.expense.label}
            </span>
            <span className="text-lg leading-none font-bold sm:text-2xl">
              ${totals.expense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <defs>
              <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-income)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-income)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-expense)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-expense)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 'auto']}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                  formatter={(value) => `$${Number(value).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}`}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="income"
              type="natural"
              fill="url(#fillIncome)"
              fillOpacity={0.4}
              stroke="var(--color-income)"
              strokeWidth={2}
            />
            <Area
              dataKey="expense"
              type="natural"
              fill="url(#fillExpense)"
              fillOpacity={0.4}
              stroke="var(--color-expense)"
              strokeWidth={2}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}