"use client";
import { SiteHeader } from "@/components/site-header";
import { SectionCards } from "@/components/section-cards";
import { FinanceOverview } from "@/components/finance-overview";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccounts } from "@/hooks/use-queries";

export default function Home() {
  const { data: accounts = [], isLoading } = useAccounts();

  return (
    <div className="@container/main flex flex-col h-full bg-sidebar md:p-4">
      <div className="flex flex-col h-full bg-background border-0 md:border md:rounded-xl p-4 md:p-6 gap-4 relative overflow-hidden">
        {/* Background pattern for glass effect */}
        <div className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10" />

        <SiteHeader title="Finances" />

        {isLoading ? (
          <>
            {/* SectionCards Skeleton */}
            <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-[180px] w-full rounded-lg" />
              ))}
            </div>

            {/* FinanceOverview Skeleton */}
            <div className="flex flex-col gap-6">
              <Skeleton className="h-10 w-full max-w-md ml-auto rounded-lg" />
              <Skeleton className="h-[450px] w-full rounded-lg" />
              <div className="flex flex-col xl:flex-row gap-6">
                <Skeleton className="h-[600px] w-full xl:w-1/2 rounded-lg" />
                <Skeleton className="h-[600px] w-full xl:w-1/2 rounded-lg" />
              </div>
            </div>
          </>
        ) : (
          <>
            <SectionCards accounts={accounts} />
            <FinanceOverview accounts={accounts} />
          </>
        )}
      </div>
    </div>
  );
}