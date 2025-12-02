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

  export type Transaction = {
    id: number;
    accountId: number;
    date: string;
    description: string;
    category: string;
    amount: number;
    status: TransactionStatus;
  };

