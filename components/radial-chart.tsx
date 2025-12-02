"use client"

import { useMemo } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"
import type { Transaction } from "@/types"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

type ChartRadialShapeProps = {
  transactions: Transaction[]
}

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(142, 76%, 36%)",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(0, 84%, 60%)",
  },
} satisfies ChartConfig

export function ChartRadialShape({ transactions }: ChartRadialShapeProps) {
  const { monthlyIncome, monthlyExpenses, netIncome } = useMemo(() => {
    // Calculate total income and expenses
    const totals = transactions.reduce(
      (acc, transaction) => {
        if (transaction.amount > 0) {
          acc.income += transaction.amount
        } else {
          acc.expenses += Math.abs(transaction.amount)
        }
        return acc
      },
      { income: 0, expenses: 0 }
    )

    // Calculate number of months in the date range
    if (transactions.length === 0) {
      return { monthlyIncome: 0, monthlyExpenses: 0, netIncome: 0 }
    }

    const dates = transactions.map(t => new Date(t.date).getTime())
    const minDate = Math.min(...dates)
    const maxDate = Math.max(...dates)
    const monthsInRange = Math.max(1, Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24 * 30)))

    // Calculate monthly averages
    const monthlyIncome = totals.income / monthsInRange
    const monthlyExpenses = totals.expenses / monthsInRange
    const netIncome = monthlyIncome - monthlyExpenses

    return { monthlyIncome, monthlyExpenses, netIncome }
  }, [transactions])

  const chartData = [
    {
      category: "expenses",
      value: monthlyExpenses,
      fill: chartConfig.expenses.color
    },
    {
      category: "income",
      value: monthlyIncome,
      fill: chartConfig.income.color
    },
  ]

  const maxValue = Math.max(monthlyIncome, monthlyExpenses)

  return (
    <div className="h-full flex flex-col">
      <div className="items-center pb-4">
        <h3 className="text-lg font-semibold">Monthly Projection</h3>
        <p className="text-sm text-muted-foreground">Average monthly income vs expenses</p>
      </div>
      <div className="flex-1 flex flex-col">
        {transactions.length === 0 ? (
          <div className="flex items-center justify-center flex-1 text-muted-foreground">
            No transaction data available
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <ChartContainer
              config={chartConfig}
              className="w-full h-full max-h-[350px] aspect-square"
            >
              <RadialBarChart
                data={chartData}
                startAngle={90}
                endAngle={450}
                innerRadius={60}
                outerRadius={120}
              >
                <PolarGrid
                  gridType="circle"
                  radialLines={false}
                  stroke="none"
                  className="first:fill-muted last:fill-background"
                  polarRadius={[66, 54]}
                />
                <RadialBar
                  dataKey="value"
                  background
                  cornerRadius={10}
                  max={maxValue}
                />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                              y={(viewBox.cy || 0) - 10}
                              className={`fill-foreground text-3xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}
                            >
                              ${Math.abs(netIncome).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 20}
                              className="fill-muted-foreground text-sm"
                            >
                              {netIncome >= 0 ? 'Net Surplus' : 'Net Deficit'}
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </PolarRadiusAxis>
              </RadialBarChart>
            </ChartContainer>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartConfig.income.color }} />
                  <span className="text-xs text-muted-foreground">Income</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-lg font-bold">${monthlyIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartConfig.expenses.color }} />
                  <span className="text-xs text-muted-foreground">Expenses</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-lg font-bold">${monthlyExpenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
