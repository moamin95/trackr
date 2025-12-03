import { Transaction, Account } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

type TransactionStatus = Transaction["status"];

const getStatusBadgeStyles = (status: TransactionStatus) => {
  switch (status) {
    case "Complete":
      return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
    case "Pending":
      return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
    case "Canceled":
      return "bg-transparent text-muted-foreground border-muted-foreground/30";
    case "Declined":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "";
  }
};

const getStatusDotColor = (status: TransactionStatus) => {
  switch (status) {
    case "Complete":
      return "bg-green-500";
    case "Pending":
      return "bg-yellow-500";
    case "Canceled":
      return "bg-muted-foreground";
    case "Declined":
      return "bg-destructive";
    default:
      return "bg-gray-500";
  }
};

export function TransactionDetails({
  transaction,
  account,
}: {
  transaction: Transaction;
  account?: Account;
}) {
  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Header with amount */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Amount</span>
          <span
            className={cn(
              "text-2xl font-bold tabular-nums",
              transaction.amount < 0 ? "text-destructive" : "text-green-600 dark:text-green-500"
            )}
          >
            {transaction.amount < 0 ? "-" : "+"}$
            {Math.abs(transaction.amount).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <Separator />
      </div>

      {/* Transaction Details */}
      <div className="flex flex-col gap-4">
        <DetailRow label="Description" value={transaction.description} />

        <DetailRow
          label="Date"
          value={new Date(transaction.date).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        />

        <DetailRow label="Category" value={transaction.category} />

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Status</span>
          <Badge
            variant="outline"
            className={cn(
              "w-24 justify-center gap-1.5 text-xs",
              getStatusBadgeStyles(transaction.status)
            )}
          >
            <span
              className={cn("size-2 rounded-full", getStatusDotColor(transaction.status))}
            />
            {transaction.status}
          </Badge>
        </div>

        {account && (
          <>
            <Separator />
            <DetailRow label="Bank" value={account.bank} />
            <DetailRow
              label="Account"
              value={`${account.accountType} (...${account.last4})`}
            />
          </>
        )}

        <Separator />

        <DetailRow label="Transfer Type" value={transaction.transferType} />

        {transaction.destination && (
          <DetailRow label="Destination" value={transaction.destination} />
        )}

        {transaction.payee && <DetailRow label="Payee" value={transaction.payee} />}

        {transaction.notes && (
          <>
            <Separator />
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground">Notes</span>
              <p className="text-sm text-foreground">{transaction.notes}</p>
            </div>
          </>
        )}

        <Separator />

        <DetailRow
          label="Transaction ID"
          value={`#${transaction.id.toString().padStart(6, "0")}`}
        />
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground text-right max-w-[60%] truncate">
        {value}
      </span>
    </div>
  );
}
