"use client";

import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import type { Account } from "@/types";

// --- Helpers --------------------------------------------------------------

function formatCurrency(amount: number) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

type AccountGroupProps = {
  accounts: Account[];
};

function AccountList({ accounts }: AccountGroupProps) {
  if (!accounts.length) {
    return <p className="text-xs text-muted-foreground">No accounts yet.</p>;
  }

  return (
    <ul className="space-y-1">
      {accounts.map((account) => (
        <li key={account.id}>
          <NavigationMenuLink asChild>
            {/* Change account.name to match your data shape */}
            <Link
              href={`/accounts/${account.id}`}
              className="flex flex-col items-start rounded-sm px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground"
            >
              <span className="truncate">{account.nickname}</span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {formatCurrency(account.balance)}
              </span>
            </Link>
          </NavigationMenuLink>
        </li>
      ))}
    </ul>
  );
}

// --- Component ------------------------------------------------------------

export function NavigationMenuWrapper({ accounts }: { accounts: Account[] }) {
  const isMobile = useIsMobile();

  // Grouping accounts by category
  const checkingAccounts = accounts.filter((a) => a.accountType === "Checking");
  const savingsAccounts = accounts.filter((a) => a.accountType === "Savings");
  const investmentAccounts = accounts.filter((a) =>
    ["Investment", "Crypto", "401k", "Roth IRA"].includes(a.accountType)
  );
  const mortgageAccounts = accounts.filter((a) => a.accountType === "Mortgage");
  const creditCardAccounts = accounts.filter(
    (a) => a.accountType === "Credit Card"
  );

  return (
    <NavigationMenu viewport={isMobile}>
      <NavigationMenuList className="flex-wrap">
        {/* Overview */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/">Overview</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Accounts Dropdown with Accordion */}
        <NavigationMenuItem className="hidden md:block">
          <NavigationMenuTrigger>Accounts</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[280px] p-3">
              <Accordion type="multiple" className="w-full space-y-1">
                <AccordionItem value="checking">
                  <AccordionTrigger className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Checking
                  </AccordionTrigger>
                  <AccordionContent className="pt-1">
                    <AccountList accounts={checkingAccounts} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="savings">
                  <AccordionTrigger className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Savings
                  </AccordionTrigger>
                  <AccordionContent className="pt-1">
                    <AccountList accounts={savingsAccounts} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="investments">
                  <AccordionTrigger className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Investments
                  </AccordionTrigger>
                  <AccordionContent className="pt-1">
                    <AccountList accounts={investmentAccounts} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="mortgage">
                  <AccordionTrigger className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Mortgage
                  </AccordionTrigger>
                  <AccordionContent className="pt-1">
                    <AccountList accounts={mortgageAccounts} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="credit-cards">
                  <AccordionTrigger className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Credit Cards
                  </AccordionTrigger>
                  <AccordionContent className="pt-1">
                    <AccountList accounts={creditCardAccounts} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
