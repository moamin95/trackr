"use client";

import { useState, useRef, useEffect } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "@/components/ui/sidebar";

// total liquid , total accounts, investments, mortgage,

export function SectionCards({ accounts }: { accounts: Account[] }) {
  const isMobile = useIsMobile();
  const { open: isSidebarOpen, state: sidebarState } = useSidebar();
  const [isInitializing, setIsInitializing] = useState(true);
  const [currentCard, setCurrentCard] = useState(0);
  const [autoSwipeEnabled, setAutoSwipeEnabled] = useState(true);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const autoSwipeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check viewport size immediately using window width (client-side only)
  const [isMobileView, setIsMobileView] = useState<boolean | null>(null);
  const [isTabletView, setIsTabletView] = useState<boolean | null>(null);
  const [screenWidth, setScreenWidth] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkViewport = () => {
        const width = window.innerWidth;
        const mobile = width < 768;
        const tablet = width >= 768 && width < 1024; // Tablet range: 768px to 1024px
        setIsMobileView(mobile);
        setIsTabletView(tablet);
        setScreenWidth(width);
        setIsInitializing(false);
      };
      // Check immediately
      checkViewport();
      // Also listen for resize
      window.addEventListener("resize", checkViewport);
      return () => window.removeEventListener("resize", checkViewport);
    }
  }, []);

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

  const cards = [
    {
      id: 0,
      title: "Total Liquid",
      value: totalRevenue,
      description: "Total Liquid",
      badge: { icon: IconTrendingUp, text: "+12.5%", variant: "secondary" as const },
      footer: {
        main: "Trending up this month",
        sub: "Visitors for the last month",
        icon: IconTrendingUp,
      },
      gradient: totalRevenue > 0 ? 'from-green-500/10 via-transparent to-green-500/5' : 'from-red-500/10 via-transparent to-red-500/5',
    },
    {
      id: 1,
      title: "Total Investments",
      value: totalInvestments,
      description: "Total Investments",
      badge: { icon: IconTrendingDown, text: "-20%", variant: "destructive" as const },
      footer: {
        main: "Down 20% this period",
        sub: "Investments needs attention",
        icon: IconTrendingDown,
      },
      gradient: totalInvestments > 0 ? 'from-green-500/10 via-transparent to-green-500/5' : 'from-red-500/10 via-transparent to-red-500/5',
    },
    {
      id: 2,
      title: "Mortgage",
      value: mortgageBalance,
      description: "Mortgage",
      badge: { icon: IconTrendingUp, text: "+12.5%", variant: "secondary" as const },
      footer: {
        main: "Escrow payment increased past cycle",
        sub: "28 Years Remaining",
        icon: IconTrendingUp,
      },
      gradient: mortgageBalance < 0 ? 'from-red-500/10 via-transparent to-red-500/5' : 'from-green-500/10 via-transparent to-green-500/5',
      isDestructive: true,
    },
    {
      id: 3,
      title: "Growth Rate",
      value: 4.5,
      description: "Growth Rate",
      badge: { icon: IconTrendingUp, text: "+4.5%", variant: "outline" as const },
      footer: {
        main: "Steady performance increase",
        sub: "Meets growth projections",
        icon: IconTrendingUp,
      },
      gradient: 'from-green-500/10 via-transparent to-green-500/5',
      isPercentage: true,
    },
  ];

  const handlePrevious = () => {
    setAutoSwipeEnabled(false);
    setCurrentCard((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setAutoSwipeEnabled(false);
    setCurrentCard((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  };

  // Auto-swipe functionality
  useEffect(() => {
    if (!isMobile || !autoSwipeEnabled) {
      if (autoSwipeIntervalRef.current) {
        clearInterval(autoSwipeIntervalRef.current);
        autoSwipeIntervalRef.current = null;
      }
      return;
    }

    autoSwipeIntervalRef.current = setInterval(() => {
      setCurrentCard((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => {
      if (autoSwipeIntervalRef.current) {
        clearInterval(autoSwipeIntervalRef.current);
      }
    };
  }, [isMobile, autoSwipeEnabled, cards.length]);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrevious();
    }
    // Reset touch refs
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const renderCard = (card: typeof cards[0]) => (
    <Card
      key={card.id}
      className={`@container/card backdrop-blur-xl bg-white/95 dark:bg-card/60 border border-gray-400/80 dark:border-white/20 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.15)] hover:shadow-[0px_12px_48px_0px_rgba(0,0,0,0.25)] transition-all duration-300 bg-gradient-to-br ${card.gradient}`}
    >
      <CardHeader>
        <CardDescription>{card.description}</CardDescription>
        <CardTitle
          className={`text-2xl font-semibold tabular-nums @[250px]/card:text-3xl ${
            card.isDestructive ? "text-destructive" : ""
          }`}
        >
          {card.isPercentage
            ? `${card.value}%`
            : formattedAsDollars(typeof card.value === "number" ? card.value : parseFloat(card.value))}
        </CardTitle>
        <CardAction>
          <Badge variant={card.badge.variant}>
            <card.badge.icon />
            {card.badge.text}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {card.footer.main} <card.footer.icon className="size-4" />
        </div>
        <div className="text-muted-foreground">{card.footer.sub}</div>
      </CardFooter>
    </Card>
  );

  // Render skeleton for mobile
  const renderMobileSkeleton = () => (
    <div className="relative md:hidden">
      <Card className="@container/card backdrop-blur-xl bg-white/95 dark:bg-card/60 border border-gray-400/80 dark:border-white/20 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.15)] bg-gradient-to-br from-green-500/10 via-transparent to-green-500/5">
        <CardHeader>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-6 w-20" />
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-32" />
        </CardFooter>
      </Card>
      <div className="flex items-center justify-center gap-1.5 mt-4">
        {[0, 1, 2, 3].map((index) => (
          <Skeleton
            key={index}
            className={`h-1.5 rounded-full ${index === 0 ? "w-8" : "w-1.5"}`}
          />
        ))}
      </div>
    </div>
  );

  // Show skeleton while initializing on mobile or tablet
  // Use CSS to ensure desktop grid doesn't show on mobile/tablet during initialization
  if (isInitializing) {
    const shouldShowSkeleton = 
      isMobileView === true || 
      isMobileView === null || 
      isTabletView === true ||
      isTabletView === null;
    
    if (shouldShowSkeleton) {
      return (
        <>
          {/* Mobile/Tablet skeleton - shown on mobile/tablet screens during initialization */}
          {renderMobileSkeleton()}
          {/* Desktop grid - hidden on mobile/tablet, will show on desktop after initialization */}
          <div className="hidden md:grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            {cards.map((card) => renderCard(card))}
          </div>
        </>
      );
    }
  }

  // Mobile carousel view OR tablet with sidebar open
  const shouldShowCarousel = 
    isMobile || 
    isMobileView === true || 
    (isTabletView === true && isSidebarOpen && sidebarState === "expanded");

  if (shouldShowCarousel) {
    return (
      <div className="relative">
        {/* Carousel Container */}
        <div
          className="overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentCard * 100}%)` }}
          >
            {cards.map((card) => (
              <div key={card.id} className="w-full flex-shrink-0">
                {renderCard(card)}
              </div>
            ))}
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setAutoSwipeEnabled(false);
                setCurrentCard(index);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentCard === index
                  ? "w-8 bg-primary"
                  : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>
      </div>
    );
  }

  // Desktop grid view - only show if we're on desktop OR tablet with sidebar closed
  // Hide on mobile and tablet with sidebar open (they use carousel)
  const shouldShowGrid = 
    !isMobile && 
    (isMobileView === false || isMobileView === null) && 
    !(isTabletView === true && isSidebarOpen && sidebarState === "expanded");

  // On 1440px screens with sidebar open, use 2x2 grid instead of 4x1
  const is1440pxWithSidebarOpen = 
    screenWidth !== null && 
    screenWidth >= 1280 && 
    screenWidth < 1536 && 
    isSidebarOpen && 
    sidebarState === "expanded";

  if (shouldShowGrid) {
    return (
      <div 
        className={
          is1440pxWithSidebarOpen
            ? "grid grid-cols-1 gap-4 @xl/main:grid-cols-2"
            : "grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4"
        }
      >
        {cards.map((card) => renderCard(card))}
      </div>
    );
  }

  // Fallback: if we somehow get here, show grid (shouldn't happen)
  return (
    <div className="hidden md:grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map((card) => renderCard(card))}
    </div>
  );
}
