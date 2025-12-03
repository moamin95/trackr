export type Account = {
  id: number;
  bank: string;
  accountType: AccountType;
  nickname: string;
  last4: string;
  balance: number;
};

export type AccountType =
  | "Checking"
  | "Savings"
  | "Roth IRA"
  | "401k"
  | "Investment"
  | "Crypto"
  | "Mortgage"
  | "Credit Card";

  export type DataType = "Accounts" | "Transactions"

  export type TransactionStatus = "Complete" | "Pending" | "Canceled" | "Declined";

  export type TransferType = "ACH" | "Wire" | "Check" | "Debit Card" | "Credit Card" | "Cash" | "Mobile Payment" | "Direct Deposit";

  export type Transaction = {
    id: number;
    accountId: number;
    date: string;
    description: string;
    category: string;
    amount: number;
    status: TransactionStatus;
    transferType: TransferType;
    destination?: string;
    payee?: string;
    notes?: string;
  };

  export type GoalType = "Savings" | "Spending Limit" | "Debt Payoff" | "Investment";

  export type Goal = {
    id: number;
    name: string;
    type: GoalType;
    targetAmount: number;
    currentAmount: number;
    deadline?: string;
    category?: string; // For tracking specific categories
    accountId?: number; // For account-specific goals
    icon?: string;
    color?: string;
    featured?: boolean;
  };

