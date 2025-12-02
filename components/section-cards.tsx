"use client";

import { useState, useEffect } from "react";
import type { Account } from "../types";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// total liquid , total accounts, investments, mortgage,

export function SectionCards({ accounts }: { accounts: Account[] }) {
  let totalRevenue: number = 0;
  let totalInvestments: number = 0;
  let mortgageBalance: number = 0;

  const formattedAsDollars = (number: number) =>
    number.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

  for (let account of accounts) {
    if (
      account.accountType === "Checking" ||
      account.accountType === "Savings"
    ) {
      totalRevenue += account.balance;
    } else if (
      account.accountType === "Roth IRA" ||
      account.accountType === "401k" ||
      account.accountType === "Investment" ||
      account.accountType === "Crypto"
    ) {
      totalInvestments += account.balance;
    } else if (account.accountType === "Mortgage") {
      mortgageBalance = account.balance;
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className={`@container/card backdrop-blur-xl bg-white/60 dark:bg-card/60 border border-gray-300/60 dark:border-white/20 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.1)] hover:shadow-[0px_12px_48px_0px_rgba(0,0,0,0.15)] transition-all duration-300 bg-gradient-to-br ${totalRevenue > 0 ? 'from-green-500/10 via-transparent to-green-500/5' : 'from-red-500/10 via-transparent to-red-500/5'}`}>
        <CardHeader>
          <CardDescription>Total Liquid</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formattedAsDollars(totalRevenue)}
          </CardTitle>
          <CardAction>
            <Badge variant="secondary">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Visitors for the last month
          </div>
        </CardFooter>
      </Card>
      <Card className={`@container/card backdrop-blur-xl bg-white/60 dark:bg-card/60 border border-gray-300/60 dark:border-white/20 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.1)] hover:shadow-[0px_12px_48px_0px_rgba(0,0,0,0.15)] transition-all duration-300 bg-gradient-to-br ${totalInvestments > 0 ? 'from-green-500/10 via-transparent to-green-500/5' : 'from-red-500/10 via-transparent to-red-500/5'}`}>
        <CardHeader>
          <CardDescription>Total Investments</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formattedAsDollars(totalInvestments)}
          </CardTitle>
          <CardAction>
            <Badge variant="destructive">
              <IconTrendingDown />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Investments needs attention
          </div>
        </CardFooter>
      </Card>
      <Card className={`@container/card backdrop-blur-xl bg-white/60 dark:bg-card/60 border border-gray-300/60 dark:border-white/20 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.1)] hover:shadow-[0px_12px_48px_0px_rgba(0,0,0,0.15)] transition-all duration-300 bg-gradient-to-br ${mortgageBalance < 0 ? 'from-red-500/10 via-transparent to-red-500/5' : 'from-green-500/10 via-transparent to-green-500/5'}`}>
        <CardHeader>
          <CardDescription>Mortgage Balance</CardDescription>
          <CardTitle className="text-2xl text-destructive font-semibold tabular-nums @[250px]/card:text-3xl">
            {formattedAsDollars(mortgageBalance)}
          </CardTitle>
          <CardAction>
            <Badge variant="secondary">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Escrow payment increased past cycle
            <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">28 Years Remaining</div>
        </CardFooter>
      </Card>
      <Card className="@container/card backdrop-blur-xl bg-white/60 dark:bg-card/60 border border-gray-300/60 dark:border-white/20 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.1)] hover:shadow-[0px_12px_48px_0px_rgba(0,0,0,0.15)] transition-all duration-300 bg-gradient-to-br from-green-500/10 via-transparent to-green-500/5">
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.5%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  );
}
