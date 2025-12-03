// lib/db.ts
import { faker } from "@faker-js/faker";
import { Account, AccountType, Transaction, TransactionStatus, TransferType, Goal } from "@/types";

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

const TRANSFER_TYPES: TransferType[] = ["ACH", "Wire", "Check", "Debit Card", "Credit Card", "Cash", "Mobile Payment", "Direct Deposit"];

const accounts: Account[] = [];
const transactions: Transaction[] = [];
const goals: Goal[] = [];
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

    // Determine transfer type based on account type and category
    const transferType: TransferType = (() => {
      if (category === "Salary") return "Direct Deposit";
      if (template.accountType === "Credit Card") return "Credit Card";
      if (template.accountType === "Checking" || template.accountType === "Savings") {
        return faker.helpers.arrayElement(["ACH", "Debit Card", "Check", "Mobile Payment"]);
      }
      if (template.accountType === "Mortgage") return "ACH";
      if (["Investment", "Roth IRA", "401k"].includes(template.accountType)) return "Wire";
      return faker.helpers.arrayElement(TRANSFER_TYPES);
    })();

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
      transferType,
      destination: faker.helpers.maybe(() => {
        if (transferType === "Wire" || transferType === "ACH") {
          return `${faker.finance.accountName()} - ${faker.finance.routingNumber()}`;
        }
        if (transferType === "Check") {
          return `Check #${faker.string.numeric(4)}`;
        }
        return undefined;
      }, { probability: 0.4 }),
      payee: faker.helpers.maybe(() => faker.person.fullName(), { probability: 0.6 }),
      notes: faker.helpers.maybe(() => {
        const noteTemplates = [
          faker.lorem.sentence(),
          `Reference: ${faker.string.alphanumeric(10).toUpperCase()}`,
          `Confirmation: ${faker.string.uuid()}`,
          faker.company.catchPhrase(),
        ];
        return faker.helpers.arrayElement(noteTemplates);
      }, { probability: 0.3 }),
    });
  }
}

// Create mock goals
goals.push(
  {
    id: 1,
    name: "Emergency Fund",
    type: "Savings",
    targetAmount: 10000,
    currentAmount: 0, // Will be calculated from transactions
    deadline: new Date(2026, 11, 31).toISOString(),
    category: "Savings",
    color: "blue",
    featured: true,
  },
  {
    id: 2,
    name: "Vacation Fund",
    type: "Savings",
    targetAmount: 5000,
    currentAmount: 0,
    deadline: new Date(2025, 5, 1).toISOString(),
    category: "Savings",
    color: "purple",
  },
  {
    id: 3,
    name: "Dining Budget",
    type: "Spending Limit",
    targetAmount: 500,
    currentAmount: 0, // Will track monthly spending
    category: "Dining",
    color: "orange",
  },
  {
    id: 4,
    name: "Mortgage Payoff",
    type: "Debt Payoff",
    targetAmount: 450000,
    currentAmount: 0, // Will calculate from mortgage payments
    deadline: new Date(2045, 11, 31).toISOString(),
    accountId: accounts.find(a => a.accountType === "Mortgage")?.id,
    color: "green",
  },
  {
    id: 5,
    name: "Investment Growth",
    type: "Investment",
    targetAmount: 50000,
    currentAmount: 0,
    deadline: new Date(2030, 11, 31).toISOString(),
    accountId: accounts.find(a => a.accountType === "Investment")?.id,
    color: "teal",
  },
  {
    id: 6,
    name: "Entertainment Budget",
    type: "Spending Limit",
    targetAmount: 300,
    currentAmount: 0,
    category: "Entertainment",
    color: "pink",
  }
);

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

export function getGoalsWithProgress(opts?: {
  startDate?: Date;
  endDate?: Date;
}): Goal[] {
  const now = new Date();
  const startDate = opts?.startDate || new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = opts?.endDate || now;

  return goals.map((goal) => {
    let currentAmount = 0;

    // Filter transactions based on date range
    const relevantTransactions = transactions.filter((t) => {
      const tDate = new Date(t.date);
      return tDate >= startDate && tDate <= endDate;
    });

    switch (goal.type) {
      case "Savings":
        // Sum positive transactions in savings category or account
        currentAmount = relevantTransactions
          .filter((t) => {
            if (goal.accountId) return t.accountId === goal.accountId && t.amount > 0;
            if (goal.category) return t.category === goal.category && t.amount > 0;
            return false;
          })
          .reduce((sum, t) => sum + t.amount, 0);
        break;

      case "Spending Limit":
        // Sum negative transactions (spending) in the category
        currentAmount = Math.abs(
          relevantTransactions
            .filter((t) => goal.category && t.category === goal.category && t.amount < 0)
            .reduce((sum, t) => sum + t.amount, 0)
        );
        break;

      case "Debt Payoff":
        // Sum debt payments (negative amounts on debt accounts)
        currentAmount = Math.abs(
          relevantTransactions
            .filter((t) => goal.accountId && t.accountId === goal.accountId && t.amount < 0)
            .reduce((sum, t) => sum + t.amount, 0)
        );
        break;

      case "Investment":
        // Track investment account balance growth
        const investmentAccount = accounts.find((a) => a.id === goal.accountId);
        if (investmentAccount) {
          currentAmount = investmentAccount.balance;
        }
        break;
    }

    return {
      ...goal,
      currentAmount,
    };
  });
}