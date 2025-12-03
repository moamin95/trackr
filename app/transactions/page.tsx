"use client";
import { useState, useMemo } from "react";
import { DateRangePicker } from "@/components/date-range";
import { DataTable } from "@/components/data-table";
import type { DataType } from "@/types";
import { SearchInput, useDebounce } from "@/components/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteHeader } from "@/components/site-header";
import { useAccounts, useTransactions } from "@/hooks/use-queries";

type DatePreset = "3months" | "6months" | "1year" | "custom";

export default function TransactionsPage() {
  const [selectedPreset, setSelectedPreset] = useState<DatePreset>("3months");
  const [dataType, setDataType] = useState<DataType>("Transactions");
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedQuery = useDebounce(searchQuery, 0);

  // Custom date range for "custom" preset only
  const [customDateRange, setCustomDateRange] = useState<{
    from: Date;
    to: Date | undefined;
  } | null>(null);

  // Calculate the current date range based on selected preset
  const currentDateRange = useMemo(() => {
    const to = new Date();
    to.setHours(23, 59, 59, 999);
    const from = new Date();
    from.setHours(0, 0, 0, 0);

    switch (selectedPreset) {
      case "3months":
        from.setMonth(from.getMonth() - 3);
        break;
      case "6months":
        from.setMonth(from.getMonth() - 6);
        break;
      case "1year":
        from.setFullYear(from.getFullYear() - 1);
        break;
      case "custom":
        return customDateRange || { from, to };
    }

    return { from, to };
  }, [selectedPreset, customDateRange]);

  const handlePresetClick = (preset: DatePreset) => {
    setSelectedPreset(preset);
  };

  // Fetch 1 year of transactions
  const oneYearAgo = useMemo(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    return date;
  }, []);

  const today = useMemo(() => new Date(), []);

  // Fetch accounts and 1 year of transactions
  const { data: accounts = [] } = useAccounts();
  const { data: allTransactions = [], isLoading: loading } = useTransactions(oneYearAgo, today);

  // Filter transactions by selected date range (client-side)
  const transactions = useMemo(() => {
    return allTransactions.filter((t) => {
      const transactionDate = new Date(t.date);
      const to = currentDateRange.to || new Date();
      return transactionDate >= currentDateRange.from &&
        transactionDate <= to;
    });
  }, [allTransactions, currentDateRange]);

  const filteredTransactions = useMemo(() => {
    if (!debouncedQuery || debouncedQuery === "") return transactions;

    return transactions.filter((t) =>
      t.description.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [transactions, debouncedQuery]);

  return (
    <div className="@container/main flex flex-col h-full bg-sidebar md:p-4">
      <div className="flex flex-col h-full bg-background border-0 md:border md:rounded-xl p-4 md:p-6 gap-4 relative overflow-hidden">
        {/* Background pattern for glass effect */}
        <div className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10" />

        <SiteHeader title="Transactions" />

        {/* Date filter and search */}
        {loading ? (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Skeleton className="h-10 w-full sm:w-80 rounded-lg" />
            <Skeleton className="h-10 w-full sm:w-64 rounded-lg" />
          </div>
        ) : (
          <div className="flex justify-between items-center gap-4">
            <SearchInput searchQuery={searchQuery} onChange={setSearchQuery} />
            <div className="flex gap-2">
              {/* <div className="flex gap-1 border rounded-md p-1">
                <Sonner
                  variant={selectedPreset === "3months" ? "secondary" : "ghost"}
                  size="sm"
                  changeTimeHandler={() => handlePresetClick("3months")}
                >
                  3M
                </Sonner>
                <Sonner
                  variant={selectedPreset === "6months" ? "secondary" : "ghost"}
                  size="sm"
                  changeTimeHandler={() => handlePresetClick("6months")}
                >
                  6M
                </Sonner>
                <Sonner
                  variant={selectedPreset === "1year" ? "secondary" : "ghost"}
                  size="sm"
                  changeTimeHandler={() => handlePresetClick("1year")}
                >
                  1Y
                </Sonner>
              </div> */}
              <DateRangePicker
                initialDateFrom={currentDateRange.from}
                initialDateTo={currentDateRange.to}
                onUpdate={({ range }) => {
                  setSelectedPreset("custom");
                  setCustomDateRange({
                    from: range.from,
                    to: range.to,
                  });
                }}
              />
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="w-full h-full rounded-lg border bg-card/60 backdrop-blur-xl p-4 space-y-4">
              {/* Table Header Skeleton */}
              <div className="flex items-center gap-4 pb-4 border-b">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32 flex-1" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>

              {/* Table Rows Skeleton */}
              {[...Array(12)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-3">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-full max-w-xs" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}

              {/* Pagination Skeleton */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Skeleton className="h-8 w-32" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
                <Skeleton className="h-8 w-32" />
              </div>
            </div>
          ) : (
            <DataTable
              dataType={dataType}
              data={filteredTransactions}
              accounts={accounts}
              defaultViewPerPage={100}
            />
          )}
        </div>
      </div>
    </div>
  );
}
