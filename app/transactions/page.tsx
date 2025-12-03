"use client";
import { useState, useEffect, useMemo } from "react";
import { DateRangePicker } from "@/components/date-range";
import { DataTable } from "@/components/data-table";
import type { Account, DataType, Transaction } from "@/types";
import { SearchInput, useDebounce } from "@/components/search-input";
import { Sonner } from "@/components/sonner-popup";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteHeader } from "@/components/site-header";

type DatePreset = "3months" | "6months" | "1year" | "custom";

export default function TransactionsPage() {
  const [selectedPreset, setSelectedPreset] = useState<DatePreset>("3months");
  const [dataType, setDataType] = useState<DataType>("Transactions");
  const [allTransactions, setAllTransactions] = useState<Transaction[] | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
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

  // Fetch accounts and 1 year of transactions on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch accounts
        const accountsRes = await fetch("/api/accounts");
        const accountsData = await accountsRes.json();
        setAccounts(accountsData.data);

        // Fetch 1 year of transactions
        const to = new Date();
        const from = new Date();
        from.setFullYear(from.getFullYear() - 1);

        const transactionsRes = await fetch(
          `/api/transactions?startDate=${from.toISOString()}&endDate=${to.toISOString()}`
        );
        if (!transactionsRes) throw new Error("Failed to fetch transactions...");
        const transactionsJson = await transactionsRes.json();
        console.log(transactionsJson, "/..")
        setAllTransactions(transactionsJson);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  return (
    <div className="@container/main flex flex-col h-full bg-sidebar p-4">
      <div className="flex flex-col h-full bg-background border rounded-xl p-6 gap-4 relative overflow-hidden">
        {/* Background pattern for glass effect */}
        <div className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10" />

        <SiteHeader title="Transactions" />

        {/* Date filter and search */}
        {loading || !filteredTransactions ? (
          <div className="flex justify-between items-center gap-4">
            <Skeleton className="h-10 w-64 rounded-lg" />
            <Skeleton className="h-10 w-full max-w-md ml-auto rounded-lg" />
          </div>
        ) : (
          <div className="flex justify-between items-center gap-4">
            <SearchInput searchQuery={searchQuery} onChange={setSearchQuery} />
            <div className="flex gap-2">
              <div className="flex gap-1 border rounded-md p-1">
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
          </div>
        )}

        {/* Data Table */}
        <div className="flex-1 overflow-hidden">
          {loading || !filteredTransactions ? (
            <Skeleton className="w-full h-full rounded-lg" />
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
