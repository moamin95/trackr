import { useState, useEffect, useMemo, useRef } from "react";
import { DateRangePicker } from "@/components/date-range";
import { DataTable } from "@components/data-table";
import type { Account, DataType, Transaction } from "@/types";
import { SpinnerColor } from "./spinner-load";
import { SearchInput, useDebounce } from "@components/search-input";
import { ChartLineInteractive } from "./line-chart";
import { Button } from "./ui/button";
import { formatDate } from "@lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { ChartCarousel } from "./chart-carousel";

type DatePreset = "3months" | "6months" | "1year" | "custom";

export const FinanceOverview = ({ accounts }: { accounts: Account[] }) => {
  const today = new Date();
  const [selectedPreset, setSelectedPreset] = useState<DatePreset>("3months");
  const [dataType, setDataType] = useState<DataType>("Transactions");
  const [allTransactions, setAllTransactions] = useState<Transaction[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tableSkeletonHeight, setTableSkeletonHeight] = useState<number>(300);

  const tableContainerRef = useRef<HTMLDivElement>(null);
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

  // Fetch 1 year of data once on mount
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const to = new Date();
        const from = new Date();
        from.setFullYear(from.getFullYear() - 1);

        const res = await fetch(
          `/api/transactions?startDate=${from.toISOString()}&endDate=${to.toISOString()}`
        );
        if (!res) throw new Error("Failed to fetch transactions...");
        const json = await res.json();
        setAllTransactions(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []); // Only run once on mount

  // Filter transactions by selected date range (client-side)
  const transactions = useMemo(() => {
    if (!allTransactions) return null;

    return allTransactions.filter((t) => {
      const transactionDate = new Date(t.date);
      const to = currentDateRange.to || new Date();
      return transactionDate >= currentDateRange.from &&
        transactionDate <= to;
    });
  }, [allTransactions, currentDateRange]);

  const filteredTransactions = useMemo(() => {
    if (!transactions) return null;
    if (!debouncedQuery || debouncedQuery === "") return transactions;

    return transactions.filter((t) =>
      t.description.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [transactions, debouncedQuery]);

  useEffect(() => {
    const calculateTableHeight = () => {
      if (tableContainerRef.current) {
        const rect = tableContainerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const availableHeight = viewportHeight - rect.top - 32;
        setTableSkeletonHeight(Math.max(300, availableHeight));
      }
    };

    calculateTableHeight();
    window.addEventListener('resize', calculateTableHeight);
    return () => window.removeEventListener('resize', calculateTableHeight);
  }, [loading, filteredTransactions]);

  return (
    <div className="flex flex-col gap-6">
      {/* Global date filter */}
      {loading || !filteredTransactions ? (
        <Skeleton className="h-10 w-full max-w-md ml-auto rounded-lg" />
      ) : (
        <div className="flex justify-end gap-2">
          <div className="flex gap-1 border rounded-md p-1">
            <Button
              variant={selectedPreset === "3months" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => handlePresetClick("3months")}
            >
              3M
            </Button>
            <Button
              variant={selectedPreset === "6months" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => handlePresetClick("6months")}
            >
              6M
            </Button>
            <Button
              variant={selectedPreset === "1year" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => handlePresetClick("1year")}
            >
              1Y
            </Button>
          </div>
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
      )}

      {/* Chart section */}
      {loading || !filteredTransactions ? (
        <Skeleton className="h-[450px] w-full rounded-lg" />
      ) : (
        <ChartLineInteractive
          dates={{
            initialDateFrom: currentDateRange.from,
            initialDateTo: currentDateRange.to
          }}
          transactions={filteredTransactions}
        />
      )}

      {/* Table and Charts section */}
      <div className="flex gap-6">
        {/* Left side - Table (50%) */}
        <div className="flex flex-col gap-4 w-1/2">
          {loading || !filteredTransactions ? (
            <Skeleton className="h-10 w-full max-w-xs rounded-lg" />
          ) : (
            <div className="flex justify-between items-center gap-4">
              <h3 className="text-lg font-semibold">Transactions</h3>
              <SearchInput searchQuery={searchQuery} onChange={setSearchQuery} />
            </div>
          )}

          <div ref={tableContainerRef}>
            {loading || !filteredTransactions ? (
              <Skeleton className="w-full rounded-lg" style={{ height: `${tableSkeletonHeight}px` }} />
            ) : (
              <DataTable
                dataType={dataType}
                data={filteredTransactions}
                accounts={accounts}
              />
            )}
          </div>
        </div>

        {/* Right side - Charts Carousel (50%) */}
        <div className="flex flex-col gap-6 w-1/2">
          {loading || !filteredTransactions ? (
            <>
              <Skeleton className="h-[500px] w-full rounded-lg" />
              <Skeleton className="flex-1 w-full rounded-lg" />
            </>
          ) : (
            <>
              <div className="h-[500px]">
                <ChartCarousel transactions={filteredTransactions} />
              </div>
              {/* TODO: Add additional component here */}
              <div className="flex-1 rounded-lg border backdrop-blur-xl bg-white/60 dark:bg-card/60 border-gray-300/60 dark:border-white/20 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.1)] hover:shadow-[0px_12px_48px_0px_rgba(0,0,0,0.15)] transition-all duration-300 flex items-center justify-center text-muted-foreground p-6">
                Additional Component Placeholder
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};