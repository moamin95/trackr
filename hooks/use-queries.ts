import { useQuery } from "@tanstack/react-query";
import type { Account, Transaction, Goal } from "@/types";

// Fetch accounts
export function useAccounts() {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const res = await fetch("/api/accounts");
      if (!res.ok) {
        throw new Error("Failed to fetch accounts");
      }
      const data = await res.json();
      return data.data as Account[];
    },
  });
}

// Fetch transactions with date range
export function useTransactions(startDate?: Date, endDate?: Date) {
  return useQuery({
    queryKey: ["transactions", startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      let url = "/api/transactions";

      if (startDate && endDate) {
        url += `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data = await res.json();
      return data as Transaction[];
    },
    enabled: !!(startDate && endDate), // Only fetch when dates are provided
  });
}

// Fetch goals with date range
export function useGoals(startDate?: Date, endDate?: Date) {
  return useQuery({
    queryKey: ["goals", startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      let url = "/api/goals";

      if (startDate && endDate) {
        url += `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch goals");
      }
      const data = await res.json();
      return data as Goal[];
    },
    enabled: !!(startDate && endDate), // Only fetch when dates are provided
  });
}
