"use client"

import { useState, useMemo } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import type { Transaction } from "@/types"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button"

type ChartRadarDotsProps = {
  transactions: Transaction[]
}

export function ChartRadarDots({ transactions }: ChartRadarDotsProps) {
  const [view, setView] = useState<"expenditures" | "income">("expenditures")

  const chartData = useMemo(() => {
    // Group by category and sum amounts
    const categoryTotals = transactions.reduce((acc, transaction) => {
      const { category, amount } = transaction

      if (!acc[category]) {
        acc[category] = { expenditures: 0, income: 0 }
      }

      if (amount < 0) {
        acc[category].expenditures += Math.abs(amount)
      } else {
        acc[category].income += amount
      }

      return acc
    }, {} as Record<string, { expenditures: number; income: number }>)

    // Convert to array and sort by the current view
    const data = Object.entries(categoryTotals)
      .map(([category, totals]) => ({
        category,
        amount: view === "expenditures" ? totals.expenditures : totals.income
      }))
      .filter(item => item.amount > 0)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6) // Top 6 categories

    return data
  }, [transactions, view])

  const chartConfig = {
    amount: {
      label: view === "expenditures" ? "Expenditures" : "Income",
      color: view === "expenditures" ? "hsl(0, 84%, 60%)" : "hsl(142, 76%, 36%)",
    },
  } satisfies ChartConfig

  const total = chartData.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="h-full w-full flex flex-col">
      <div className="items-center pb-4">
        <div className="flex items-center justify-between w-full">
          <div>
            <h3 className="text-lg font-semibold">Category Breakdown</h3>
            <p className="text-sm text-muted-foreground">
              Top {chartData.length} categories by {view}
            </p>
          </div>
          <div className="flex gap-1 border rounded-md p-1">
            <Button
              variant={view === "expenditures" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("expenditures")}
              className="h-8 text-xs"
            >
              Expenses
            </Button>
            <Button
              variant={view === "income" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("income")}
              className="h-8 text-xs"
            >
              Income
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center flex-1 text-muted-foreground">
            No {view} data available
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <ChartContainer
              config={chartConfig}
              className="w-full h-full max-h-[400px] aspect-square"
            >
              <RadarChart data={chartData} outerRadius="70%">
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => value}
                      formatter={(value) => `$${Number(value).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}`}
                    />
                  }
                />
                <PolarAngleAxis
                  dataKey="category"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => value.length > 12 ? value.substring(0, 12) + '...' : value}
                />
                <PolarGrid />
                <Radar
                  dataKey="amount"
                  fill={chartConfig.amount.color}
                  fillOpacity={0.6}
                  stroke={chartConfig.amount.color}
                  strokeWidth={2}
                  dot={{
                    r: 4,
                    fillOpacity: 1,
                  }}
                />
              </RadarChart>
            </ChartContainer>
            <div className="flex items-center justify-center gap-2 pt-4 text-sm">
              <div className="flex items-center gap-2 leading-none font-medium">
                {view === "expenditures" ? (
                  <>
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <span>Total: ${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>Total: ${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
