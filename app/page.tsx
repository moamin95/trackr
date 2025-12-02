"use client";
import { useState, useEffect } from "react";
import { SiteHeader } from "@/components/site-header";
import { SectionCards } from "@/components/section-cards";
import { SpinnerColor } from "@/components/spinner-load";
import { NavigationMenuWrapper } from "@/components/navigation-menu";
import { FinanceOverview } from "@/components/finance-overview";
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/accounts");
        const data = await res.json();
        setAccounts(data.data);
      } catch (err) {
        if (err) throw new Error("Failed to fetch accounts...");
      } finally {
        setLoading(false);
      }
    };

    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/transactions");
        const data = await res.json();
      } catch (err) {
        throw new Error("Failed to fetch transactions...");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
    fetchTransactions();
  }, []);

  return (
    <div className="@container/main flex flex-col h-full bg-sidebar p-4">
      <div className="flex flex-col h-full bg-background border rounded-xl p-6 gap-4 relative overflow-hidden">
        {/* Background pattern for glass effect */}
        <div className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10" />

        <SiteHeader title="Finances" />
        <SectionCards accounts={accounts} />
        <FinanceOverview accounts={accounts} />
      </div>
    </div>
  );
}