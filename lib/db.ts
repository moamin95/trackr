// lib/db.ts
import { faker } from "@faker-js/faker";
import { Account, AccountType, Transaction, TransactionStatus } from "@/types";

const ACCOUNT_TEMPLATES: Array<{ bank: string; accountType: AccountType }> = [
  { accountType: "Checking", bank: "CitiBank" },
  { accountType: "Savings", bank: "American Express" },
  { accountType: "Savings", bank: "Chase" },
  { accountType: "Roth IRA", bank: "Vanguard" },
  { accountType: "401k", bank: "Fidelity" },
  { accountType: "Investment", bank: "Robinhood" },
  { accountType: "Crypto", bank: "Coinbase" },
  { accountType: "Mortgage", bank: "Chase" },
  { accountType: "Credit Card", bank: "American Express" },
  { accountType: "Credit Card", bank: "Chase" },
];

const CATEGORIES = [
  "Groceries",
  "Dining",
  "Travel",
  "Rent",
  "Entertainment",
  "Utilities",
  "Investment Contribution",
  "Retirement Contribution",
  "Salary",
  "Dividend",
  "Crypto Trade",
  "Mortgage Payment",
  "Interest",
] as const;

const STATUSES: TransactionStatus[] = ["Complete", "Pending", "Canceled", "Declined"];

const accounts: Account[] = [];
const transactions: Transaction[] = [];
const TX_PER_ACCOUNT = 100;

let nextAccountId = 1;
let nextTxId = 1;

for (const template of ACCOUNT_TEMPLATES) {
  const accountId = nextAccountId++;

  const account: Account = {
    id: accountId,
    bank: template.bank,
    accountType: template.accountType,
    nickname: `${template.bank} ${template.accountType}`,
    last4: faker.string.numeric(4),
    balance:
      template.accountType === "Mortgage"
        ? -Number(faker.finance.amount({ min: 400000, max: 500000 }))
        : template.accountType === "Credit Card"
          ? -Number(faker.finance.amount({ min: 0, max: 2000 }))
          : template.accountType === "Investment"
            ? Number(faker.finance.amount({ min: 0, max: 5000 }))
            : ["Checking", "Savings"].includes(template.accountType)
              ? Number(faker.finance.amount({ min: 0, max: 10000 }))
              : Number(faker.finance.amount({ min: 0, max: 10000 })),
  };

  accounts.push(account);

  // Transactions
  for (let i = 0; i < TX_PER_ACCOUNT; i++) {
    const typeSpecificCategories = (() => {
      switch (template.accountType) {
        case "Checking":
        case "Savings":
          return ["Groceries", "Dining", "Rent", "Salary"];
        case "Credit Card":
          return [
            "Groceries",
            "Dining",
            "Travel",
            "Entertainment",
            "Utilities",
          ];
        case "Investment":
          return ["Investment Contribution", "Dividend"];
        case "Roth IRA":
        case "401k":
          return ["Retirement Contribution", "Dividend"];
        case "Crypto":
          return ["Crypto Trade", "Investment Contribution"];
        case "Mortgage":
          return ["Mortgage Payment", "Interest"];
        default:
          return [...CATEGORIES];
      }
    })();

    // Pick the category FIRST
    const category = faker.helpers.arrayElement(typeSpecificCategories);

    // Weighted status distribution (most transactions are complete)
    const status = faker.helpers.weightedArrayElement([
      { weight: 85, value: "Complete" as TransactionStatus },
      { weight: 10, value: "Pending" as TransactionStatus },
      { weight: 3, value: "Canceled" as TransactionStatus },
      { weight: 2, value: "Declined" as TransactionStatus },
    ]);

    transactions.push({
      id: nextTxId++,
      accountId,
      date: faker.date
        .between({ from: "2025-01-01", to: "2025-12-01" })
        .toISOString(),
      description: (() => {
        if (template.accountType === "Mortgage")
          return "Monthly mortgage payment";
        if (template.accountType === "Crypto")
          return `${faker.helpers.arrayElement(["BTC", "ETH", "SOL", "USDC"])} Trade`;
        if (template.accountType === "Investment") {
          const stocks = ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA", "NVDA"];
          return `${faker.helpers.arrayElement(["Buy", "Sell", "Dividend"])} ${faker.helpers.arrayElement(stocks)}`;
        }
        if (template.accountType === "Roth IRA" || template.accountType === "401k")
          return "Automatic contribution";

        // Category-specific merchants
        const merchantsByCategory: Record<string, string[]> = {
          Groceries: ["Whole Foods", "Trader Joe's", "Safeway", "Kroger", "Costco"],
          Dining: ["Chipotle", "Panera", "Starbucks", "McDonald's", "Subway"],
          Travel: ["United Airlines", "Marriott", "Hilton", "Airbnb", "Hertz"],
          Entertainment: ["Netflix", "Spotify", "AMC Theaters", "Steam", "PlayStation"],
          Utilities: ["PG&E", "Electric Co", "Water Utility", "Internet Provider"],
          Rent: ["Rent Payment", "Monthly Rent"],
          Salary: ["Direct Deposit - Employer", "Payroll Deposit"],
        };

        // Use the category we picked earlier
        const merchants = merchantsByCategory[category] || ["Generic Merchant"];
        return faker.helpers.arrayElement(merchants);
      })(),
      category,
      status,
      amount: (() => {
        if (template.accountType === "Mortgage")
          return -Number(faker.finance.amount({ min: 1500, max: 4000 }));
        if (template.accountType === "Credit Card")
          return -Number(faker.finance.amount({ min: 50, max: 1500 }));
        if (["Investment", "Roth IRA", "401k"].includes(template.accountType))
          return Number(faker.finance.amount({ min: -5000, max: 5000 }));
        return Number(faker.finance.amount({ min: -500, max: 5000 }));
      })(),

    });
  }
}

// Rest of your DB helper functions remain the same
export function getAccounts(opts?: {
  accountType?: AccountType;
  bank?: string;
  page?: number;
  pageSize?: number;
}) {
  const { accountType, bank, page = 1, pageSize = 10 } = opts || {};
  let data = accounts;

  if (accountType) data = data.filter((a) => a.accountType === accountType);
  if (bank) data = data.filter((a) => a.bank === bank);

  return {
    total: data.length,
    page,
    pageSize,
    data: data.slice((page - 1) * pageSize, page * pageSize),
  };
}

export function getAllTransactions(opts?: {
  startDate?: Date;
  endDate?: Date;
}) {
  if (opts) {
    const { startDate, endDate } = opts;
    return transactions.filter((t) => {
      const tDate = new Date(t.date);
      return tDate >= startDate! && tDate <= endDate!;
    });
  } else {
    return transactions;
  }
}

export function getTransactions(opts: {
  accountId: number;
  page?: number;
  pageSize?: number;
}) {
  const { accountId, page = 1, pageSize = 20 } = opts;
  const list = transactions.filter((t) => t.accountId === accountId);

  return {
    total: list.length,
    page,
    pageSize,
    data: list.slice((page - 1) * pageSize, page * pageSize),
  };
}