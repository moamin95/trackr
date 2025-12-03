"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChartRadarDots } from "./radar-chart"
import { ChartRadialShape } from "./radial-chart"
import type { Transaction } from "@/types"

type ChartCarouselProps = {
  transactions: Transaction[]
}

export function ChartCarousel({ transactions }: ChartCarouselProps) {
  const [currentChart, setCurrentChart] = useState(0)

  const charts = [
    {
      id: 0,
      name: "Category Breakdown",
      component: <ChartRadarDots transactions={transactions} />
    },
    {
      id: 1,
      name: "Monthly Projection",
      component: <ChartRadialShape transactions={transactions} />
    }
  ]

  const handlePrevious = () => {
    setCurrentChart((prev) => (prev === 0 ? charts.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentChart((prev) => (prev === charts.length - 1 ? 0 : prev + 1))
  }

  return (
    <Card className="h-full flex flex-col gap-4 p-6 backdrop-blur-xl bg-white/95 dark:bg-card/60 border-gray-400/80 dark:border-white/20 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.15)] hover:shadow-[0px_12px_48px_0px_rgba(0,0,0,0.25)] transition-all duration-300">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {charts.map((chart, index) => (
            <button
              key={chart.id}
              onClick={() => setCurrentChart(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentChart === index
                  ? "w-8 bg-primary"
                  : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chart Display */}
      <div className="flex-1 relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentChart * 100}%)` }}
        >
          {charts.map((chart) => (
            <div key={chart.id} className="w-full flex-shrink-0 h-full">
              {chart.component}
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
