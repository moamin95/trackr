# trackr. - Modern Finance Management Platform

<div align="center">

  ![trackr](https://img.shields.io/badge/trackr-Enterprise-ef4444?style=for-the-badge)
  ![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?style=for-the-badge&logo=tailwind-css)
  ![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-ff4154?style=for-the-badge&logo=react-query)

  **A sleek, modern finance tracking application built with cutting-edge web technologies**

</div>

---

## 🌟 Overview

**trackr.** is a comprehensive financial management platform that combines elegant design with powerful functionality. Built from the ground up with performance and user experience in mind, trackr delivers a seamless interface for tracking transactions, managing accounts, and monitoring financial goals.

### ✨ Design Philosophy

- **Glass Morphism UI**: Beautiful frosted glass effects with subtle backdrop blur
- **Smooth Animations**: Carefully crafted transitions and micro-interactions
- **Responsive First**: Fully optimized for all screen sizes (mobile, tablet, desktop, ultra-wide)
- **Dark Mode Native**: Built-in dark mode support with theme persistence
- **Accessibility**: ARIA-compliant components with keyboard navigation

---

## 🚀 Key Features

### 📊 Finance Overview Dashboard
- **Interactive Line Charts**: Visualize your financial trends over time
- **Category Breakdown**: Radar charts showing spending patterns by category
- **Real-time Stats**: Dynamic account balance summaries
- **Multiple Views**: Seamlessly switch between 3M, 6M, 1Y, and custom date ranges

### 💳 Advanced Transaction Management
- **Smart Data Table**:
  - Sort by any column (date, amount, description, etc.)
  - Multi-filter support (bank, status, category)
  - Intelligent search with debouncing
  - Customizable page size (25, 50, 100 rows)
  - Responsive pagination
- **Transaction Details Drawer**: Click any row to view comprehensive transaction details including:
  - Transfer type, destination, payee
  - Full transaction history
  - Custom notes and metadata
- **Bulk Operations**: Filter by multiple banks and transaction statuses simultaneously

### 🎯 Goal Tracking System
- **Auto-calculated Progress**: Goals automatically track progress from transaction data
- **Multiple Goal Types**:
  - **Savings Goals**: Track progress toward savings targets
  - **Spending Limits**: Monthly budget caps with over-budget warnings
  - **Debt Payoff**: Monitor loan and mortgage payments
  - **Investment Targets**: Track investment account growth
- **Carousel Navigation**: Smooth transitions between goal pages with staggered animations
- **Visual Progress Bars**: Color-coded indicators with percentage completion

### 🔍 Smart Filtering & Search
- **Global Date Filtering**: Apply date ranges across all views simultaneously
- **Debounced Search**: Instant search with optimized performance
- **Multi-select Filters**: Combine multiple filter criteria
- **Filter Persistence**: Maintains filter state across navigation

### 🎨 Premium User Experience
- **Toast Notifications**: Non-intrusive feedback for user actions
- **Skeleton Loading**: Smooth loading states with content placeholders
- **Sticky Headers**: Table headers remain visible while scrolling
- **Hover Effects**: Subtle interactions that guide user attention
- **Collapsible Sidebar**: Space-efficient navigation with icon mode

---

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 16** - React framework with App Router and Turbopack
- **React 19** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **Radix UI** - Unstyled, accessible primitives
- **Lucide React** - Consistent icon system
- **Tabler Icons** - Additional icon set

### Data Visualization
- **Recharts** - Composable charting library
- **Custom Charts**:
  - Interactive line charts
  - Radar charts for category analysis
  - Responsive chart carousel

### State Management & Data Fetching
- **TanStack Query (React Query)** - Powerful data synchronization and caching
  - Automatic background refetching
  - Smart query deduplication
  - Built-in loading and error states
  - Optimistic updates ready
  - 1-minute stale time, 5-minute cache time
- **React Hooks** - Modern state management
- **useMemo** - Optimized computations
- **useDebounce** - Performance-optimized search
- **Client-side Filtering** - Lightning-fast data operations

### Development Tools
- **Faker.js** - Realistic mock data generation
- **ESLint** - Code quality enforcement
- **Git** - Version control

---

## ⚡ Performance Optimizations

### 🎯 Smart Data Management
1. **TanStack Query Caching**: Intelligent data synchronization with automatic caching
   - **Query Deduplication**: Multiple components requesting the same data share a single query
   - **Smart Background Refetching**: Data stays fresh with automatic updates
   - **Stale-While-Revalidate**: Show cached data instantly while fetching updates
   - **1-minute Stale Time**: Data is considered fresh for 1 minute, eliminating redundant requests
   - **5-minute Garbage Collection**: Unused cached data is cleaned up automatically
   - **Optimized Network Usage**: Dramatically reduces API calls across the application

2. **Single Fetch Strategy**: Load 1 year of data once, filter client-side
   - Eliminates redundant API calls when changing date ranges
   - Instant filter/date range updates
   - Reduced server load

3. **Memoized Computations**:
   - Transaction filtering cached with `useMemo`
   - Goal progress calculations optimized
   - Prevents unnecessary re-renders

4. **Debounced Search**:
   - Search input debounced to reduce filter operations
   - Smooth typing experience
   - Optimized re-render cycles

### 🖼️ UI/UX Optimizations
1. **Lazy Loading**:
   - Skeleton screens during data fetch
   - Progressive content revelation
   - Perceived performance boost

2. **Responsive Breakpoints**:
   - Tailored layouts for each screen size (sm, md, lg, xl, 2xl)
   - Mobile-first approach
   - Conditional rendering based on viewport

3. **Transition Throttling**:
   - Carousel transitions prevent rapid clicks
   - Smooth, controlled animations (200ms duration)
   - Staggered card entrance for visual appeal

4. **Virtualized Rendering**:
   - Paginated tables prevent DOM bloat
   - Efficient memory usage
   - Smooth scrolling performance

---

## 📁 Project Structure

```
trackr/
├── app/
│   ├── api/
│   │   ├── accounts/route.ts      # Account data endpoints
│   │   ├── transactions/route.ts  # Transaction endpoints
│   │   └── goals/route.ts         # Goal tracking endpoints
│   ├── transactions/
│   │   └── page.tsx               # Full-page transactions view
│   ├── layout.tsx                 # Root layout with providers
│   ├── page.tsx                   # Finance overview dashboard
│   ├── globals.css                # Global styles
│   └── icon.svg                   # App favicon
├── components/
│   ├── ui/                        # shadcn/ui components
│   │   ├── sheet.tsx              # Drawer component
│   │   ├── progress.tsx           # Progress bars
│   │   ├── button.tsx             # Button variants
│   │   ├── skeleton.tsx           # Loading skeletons
│   │   ├── sonner.tsx             # Toast notifications
│   │   └── ...
│   ├── query-provider.tsx         # TanStack Query provider
│   ├── app-sidebar.tsx            # Navigation sidebar
│   ├── data-table.tsx             # Advanced data table
│   ├── goal-tracker.tsx           # Goal tracking carousel
│   ├── transaction-details.tsx    # Transaction drawer
│   ├── chart-carousel.tsx         # Chart slider
│   └── line-chart.tsx             # Interactive charts
├── hooks/
│   ├── use-queries.ts             # TanStack Query hooks (accounts, transactions, goals)
│   └── use-mobile.ts              # Mobile detection hook
├── lib/
│   ├── db.ts                      # Mock database & data generation
│   └── utils.ts                   # Utility functions
├── types.d.ts                     # TypeScript definitions
└── tailwind.config.ts             # Tailwind configuration
```

---

## 🎨 Design System

### Color Palette
- **Primary**: Red accent (#ef4444)
- **Background**: Dynamic (light/dark mode)
- **Cards**: Glass morphism with backdrop blur (bg-white/60 dark:bg-card/60)
- **Borders**: Subtle with transparency (border-gray-300/60)
- **Shadows**: Layered with blur for depth

### Typography
- **Sans**: Geist Sans (modern, clean)
- **Mono**: Geist Mono (code & numbers)
- **Hierarchy**: Clear heading scales (text-lg, text-xl, text-2xl)

### Spacing & Layout
- **Consistent Grid**: 4px/8px base units
- **Responsive Gaps**: Scales with viewport (gap-2, gap-4, gap-6)
- **Card Padding**: Generous whitespace (p-3, p-6)

### Animation Principles
- **Duration**: 200-300ms for most transitions
- **Easing**: Smooth cubic-bezier curves
- **Staggered Entrance**: 50ms delay between elements
- **Opacity + Transform**: Fade + slide for polish

---

## 📊 Data Model

### Transaction
```typescript
{
  id: number
  accountId: number
  date: string
  description: string
  category: string
  amount: number
  status: "Complete" | "Pending" | "Canceled" | "Declined"
  transferType: "ACH" | "Wire" | "Check" | "Debit Card" | "Credit Card" | "Cash" | "Mobile Payment" | "Direct Deposit"
  destination?: string
  payee?: string
  notes?: string
}
```

### Goal
```typescript
{
  id: number
  name: string
  type: "Savings" | "Spending Limit" | "Debt Payoff" | "Investment"
  targetAmount: number
  currentAmount: number  // Auto-calculated from transactions
  deadline?: string
  category?: string
  accountId?: number
  color?: string
}
```

### Account
```typescript
{
  id: number
  bank: string
  accountType: "Checking" | "Savings" | "Roth IRA" | "401k" | "Investment" | "Crypto" | "Mortgage" | "Credit Card"
  nickname: string
  last4: string
  balance: number
}
```

---

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/trackr.git

# Navigate to project
cd trackr

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

---

## 🎯 Usage Examples

### Filtering Transactions
1. Select date range (3M, 6M, 1Y, or custom)
2. Use search bar for quick filtering by description
3. Click bank/status dropdown filters for granular control
4. Combine multiple filters for precise results
5. All filters sync across Overview and Transactions pages

### Viewing Transaction Details
1. Click any transaction row in the table
2. Drawer slides in from the right with smooth animation
3. View comprehensive transaction information:
   - Full amount with color coding (red for expenses, green for income)
   - Transaction date, category, and status
   - Bank and account details
   - Transfer type, destination, and payee
   - Additional notes
4. Click outside or X to close

### Tracking Goals
1. Goals auto-calculate progress from transaction data based on:
   - **Savings**: Sum of deposits in category/account
   - **Spending Limits**: Total spending in category for the period
   - **Debt Payoff**: Cumulative payments made
   - **Investment**: Current account balance
2. Navigate between goals using carousel arrows
3. View progress percentages, amounts, and deadlines
4. Monitor over-budget warnings for spending limits (red indicators)

---

## 🔧 TanStack Query Integration

### Architecture

The application uses TanStack Query (React Query) for all data fetching and caching. This provides automatic background updates, intelligent caching, and optimized network usage.

### Custom Query Hooks

Located in `hooks/use-queries.ts`, the application provides three main query hooks:

#### 1. `useAccounts()`
Fetches all user accounts with automatic caching.

```typescript
import { useAccounts } from "@/hooks/use-queries";

function MyComponent() {
  const { data: accounts = [], isLoading, isError } = useAccounts();

  if (isLoading) return <Skeleton />;
  if (isError) return <ErrorMessage />;

  return <AccountsList accounts={accounts} />;
}
```

**Cache Key**: `["accounts"]`
**Behavior**: Data cached indefinitely, refetches on mount if stale (>1 minute)

#### 2. `useTransactions(startDate, endDate)`
Fetches transactions within a specified date range.

```typescript
import { useTransactions } from "@/hooks/use-queries";

function TransactionsComponent() {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const {
    data: transactions = [],
    isLoading
  } = useTransactions(oneYearAgo, new Date());

  // Client-side filtering for instant date range changes
  const filtered = transactions.filter(t => /* filter logic */);

  return <TransactionTable data={filtered} />;
}
```

**Cache Key**: `["transactions", startDate.toISOString(), endDate.toISOString()]`
**Behavior**: Only fetches when dates are provided, automatically refetches if date range changes

#### 3. `useGoals(startDate, endDate)`
Fetches financial goals within a date range.

```typescript
import { useGoals } from "@/hooks/use-queries";

function GoalsComponent() {
  const { data: goals = [], isLoading } = useGoals(startDate, endDate);

  return <GoalTracker goals={goals} />;
}
```

**Cache Key**: `["goals", startDate.toISOString(), endDate.toISOString()]`
**Behavior**: Similar to transactions, with date-based cache invalidation

### Query Configuration

The global QueryClient configuration (in `components/query-provider.tsx`):

```typescript
{
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,        // 1 minute - data is fresh for 1 min
      gcTime: 5 * 60 * 1000,       // 5 minutes - cache cleanup after 5 min
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      retry: 1,                    // Retry failed requests once
    },
  },
}
```

### Benefits in Action

1. **Shared Cache**: Navigate between Overview and Transactions pages - accounts load instantly from cache
2. **Smart Updates**: Data refreshes in the background when it becomes stale
3. **Loading States**: Built-in `isLoading` state for skeleton screens
4. **Error Handling**: Automatic retry logic with `isError` state
5. **Performance**: Dramatically reduced API calls - from 6+ calls to 1-2 calls per page load

### Adding New Queries

To add a new query hook:

1. Define the hook in `hooks/use-queries.ts`:

```typescript
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      return data as Category[];
    },
  });
}
```

2. Use it in your component:

```typescript
const { data: categories = [], isLoading } = useCategories();
```

---

## 🔮 Future Enhancements

- [ ] User authentication & multi-user support
- [ ] Real bank API integrations (Plaid, Yodlee)
- [ ] Budget planning tools with forecasting
- [ ] Recurring transaction detection and management
- [ ] Export to CSV/PDF reports
- [ ] Mobile app (React Native)
- [ ] AI-powered spending insights and recommendations
- [ ] Bill payment reminders and notifications
- [ ] Investment portfolio tracking with real-time quotes
- [ ] Tax report generation (1099, capital gains)
- [ ] Split transactions and shared expenses
- [ ] Custom categories and tags

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use existing component patterns from shadcn/ui
- Maintain responsive design across all breakpoints
- Add proper error handling and loading states
- Write clear commit messages

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **shadcn/ui** - For the beautiful component library
- **Radix UI** - For accessible primitives
- **Vercel** - For Next.js framework
- **Tailwind Labs** - For Tailwind CSS
- **TanStack** - For React Query (TanStack Query)
- **Recharts** - For data visualization
- **Lucide** - For the icon system
- **Tabler** - For additional icons

---

<div align="center">

  **Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**

  ⚡ **trackr.** - Your financial journey, simplified.

</div>
