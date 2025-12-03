"use client";

import { useState, useEffect } from "react";
import { Goal } from "@/types";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const getColorStyles = (color?: string) => {
  switch (color) {
    case "blue":
      return "from-blue-500/20 to-blue-600/20 border-blue-500/30";
    case "purple":
      return "from-purple-500/20 to-purple-600/20 border-purple-500/30";
    case "orange":
      return "from-orange-500/20 to-orange-600/20 border-orange-500/30";
    case "green":
      return "from-green-500/20 to-green-600/20 border-green-500/30";
    case "teal":
      return "from-teal-500/20 to-teal-600/20 border-teal-500/30";
    case "pink":
      return "from-pink-500/20 to-pink-600/20 border-pink-500/30";
    default:
      return "from-gray-500/20 to-gray-600/20 border-gray-500/30";
  }
};

const getProgressColor = (color?: string) => {
  switch (color) {
    case "blue":
      return "bg-blue-500";
    case "purple":
      return "bg-purple-500";
    case "orange":
      return "bg-orange-500";
    case "green":
      return "bg-green-500";
    case "teal":
      return "bg-teal-500";
    case "pink":
      return "bg-pink-500";
    default:
      return "bg-primary";
  }
};

export function GoalTracker({ goals }: { goals: Goal[] }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const goalsPerPage = 3;
  const totalPages = Math.ceil(goals.length / goalsPerPage);

  const displayedGoals = goals.slice(
    currentPage * goalsPerPage,
    (currentPage + 1) * goalsPerPage
  );

  const handlePrevious = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStart !== null) {
      const currentTouch = e.targetTouches[0].clientX;
      const diff = touchStart - currentTouch;

      // Prevent scroll if horizontal swipe is detected
      if (Math.abs(diff) > 10) {
        e.preventDefault();
      }
    }
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentPage < totalPages - 1) {
      handleNext();
    }
    if (isRightSwipe && currentPage > 0) {
      handlePrevious();
    }
  };

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Goals - Compact List with Pagination */}
      <div
        className="flex flex-col gap-2 flex-1 touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ touchAction: 'pan-y' }}
      >
        <div className="flex flex-col gap-2 min-h-0">
          {displayedGoals.map((goal, index) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const isOverBudget = goal.type === "Spending Limit" && progress > 100;

            return (
              <div
                key={goal.id}
                className={cn(
                  "rounded-lg border bg-card/60 p-3 flex flex-col gap-2 hover:bg-card/80 transition-all duration-300",
                  isTransitioning
                    ? "opacity-0 translate-x-4"
                    : "opacity-100 translate-x-0"
                )}
                style={{
                  transitionDelay: isTransitioning ? '0ms' : `${index * 50}ms`
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{goal.name}</p>
                    <p className="text-xs text-muted-foreground">{goal.type}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-sm font-semibold", isOverBudget && "text-destructive")}>
                      {Math.round(progress)}%
                    </p>
                    {goal.deadline && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(goal.deadline).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </div>
                <Progress
                  value={Math.min(progress, 100)}
                  className="h-1.5"
                  indicatorClassName={cn(
                    getProgressColor(goal.color),
                    isOverBudget && "bg-destructive"
                  )}
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    ${goal.currentAmount.toLocaleString()} / $
                    {goal.targetAmount.toLocaleString()}
                  </span>
                  {isOverBudget && (
                    <span className="text-destructive font-medium">Over budget!</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Navigation */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handlePrevious(e)}
              disabled={currentPage === 0}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground">
              {currentPage + 1} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleNext(e)}
              disabled={currentPage === totalPages - 1}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="border-t pt-3 mt-auto">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <TrendingUp className="size-4" />
            <span>{goals.length} Active Goals</span>
          </div>
          <span className="text-muted-foreground">
            {goals.filter((g) => (g.currentAmount / g.targetAmount) * 100 >= 100).length}{" "}
            Completed
          </span>
        </div>
      </div>
    </div>
  );
}
