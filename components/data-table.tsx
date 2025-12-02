import { ReactNode, useEffect, useState, useMemo } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ButtonGroup } from "@/components/ui/button-group";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type {
    DataType,
    Transaction,
    Account,
    TransactionStatus,
} from "@/types";
import { Button } from "./ui/button";
import { PaginationWrapper } from "./pagination";
import { SelectWrapper } from "./select";
import { TableHeaderDropDownMenu } from "./table-header-drop";
import { cn } from "@/lib/utils";

type SortConfig = {
    key: keyof Transaction | null;
    direction: "asc" | "desc" | null;
};

export const DataTable = ({
    dataType,
    data,
    accounts,
}: {
    dataType: DataType;
    data: Transaction[];
    accounts: Account[];
}) => {
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

    const [page, setPage] = useState(1);
    const [viewPerPage, setViewPerPage] = useState(25);
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: "date",
        direction: "desc",
    });
    const [selectedBanks, setSelectedBanks] = useState<Set<string>>(new Set());
    const [selectedStatus, setSelectedStatus] = useState<Set<string>>(new Set());
    
    const accountMap = new Map();

    for (let account of accounts) {
        accountMap.set(account.id, account.bank);
    }

    // Filter the data by selected banks and status
    const filteredData = useMemo(() => {
        return data.filter((transaction) => {
            // Filter by bank
            if (selectedBanks.size > 0) {
                const bank = accountMap.get(transaction.accountId);
                if (!selectedBanks.has(bank)) return false;
            }

            // Filter by status
            if (selectedStatus.size > 0) {
                if (!selectedStatus.has(transaction.status)) return false;
            }

            return true;
        });
    }, [data, selectedBanks, selectedStatus]);

    // Sort the data
    const sortedData = useMemo(() => {
        if (!sortConfig.key || !sortConfig.direction) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aValue = a[sortConfig.key!];
            const bValue = b[sortConfig.key!];

            // Handle date sorting
            if (sortConfig.key === "date") {
                const aDate = new Date(aValue as string).getTime();
                const bDate = new Date(bValue as string).getTime();
                return sortConfig.direction === "asc" ? aDate - bDate : bDate - aDate;
            }

            // Handle number sorting
            if (typeof aValue === "number" && typeof bValue === "number") {
                return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
            }

            // Handle string sorting
            const aStr = String(aValue).toLowerCase();
            const bStr = String(bValue).toLowerCase();

            if (aStr < bStr) return sortConfig.direction === "asc" ? -1 : 1;
            if (aStr > bStr) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortConfig]);

    const totalPages = Math.max(1, Math.ceil(sortedData.length / viewPerPage));

    useEffect(() => {
        setPage(1);
    }, [sortedData, viewPerPage]);

    const pagedData = useMemo(() => {
        const safePage = Math.min(page, totalPages);
        const start = (safePage - 1) * viewPerPage;
        const end = start + viewPerPage;
        return sortedData.slice(start, end);
    }, [sortedData, page, viewPerPage, totalPages]);

    const bankAccounts = useMemo(() => {
        return new Set(data.map((transaction) => accountMap.get(transaction.accountId)))
    }, [data]);

    const statusTypes = useMemo(() => {
        return new Set(data.map((transaction) => transaction.status))
    }, [data])

    console.log(statusTypes, "....");

    const handleSort = (key: keyof Transaction) => {
        setSortConfig((prev) => {
            if (prev.key === key) {
                // Cycle through: asc -> desc -> null
                if (prev.direction === "asc") return { key, direction: "desc" };
                if (prev.direction === "desc") return { key: null, direction: null };
            }
            return { key, direction: "asc" };
        });
    };

    const handleBankToggle = (bank: string) => {
        setSelectedBanks((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(bank)) {
                newSet.delete(bank);
            } else {
                newSet.add(bank);
            }
            return newSet;
        });
    };

    const handleStatusToggle = (status: string) => {
        setSelectedStatus((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(status)) {
                newSet.delete(status)
            } else {
                newSet.add(status)
            }
            return newSet
        })
    }

    const handleClearAll = () => {
        setSelectedBanks(new Set());
    };

    const handleSelectAll = () => {
        setSelectedBanks(new Set(bankAccounts));
    };

    const handleClearAllStatus = () => {
        setSelectedStatus(new Set())
    }

    const handleSelectAllStatus = () => {
        setSelectedStatus(new Set(statusTypes));
    }

    console.log({ pagedData });

    const getSortIcon = (key: string) => {
        if (sortConfig.key !== key) return <ArrowUpDown className="ml-2 h-4 w-4" />;
        if (sortConfig.direction === "asc") return <ArrowUp className="ml-2 h-4 w-4" />;
        if (sortConfig.direction === "desc") return <ArrowDown className="ml-2 h-4 w-4" />;
        return <ArrowUpDown className="ml-2 h-4 w-4" />;
    };

    const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));
    const handlePrevious = () => setPage((prev) => Math.max(prev - 1, 1));
    const handlePageClick = (pageNum: number) => setPage(pageNum);
    const handlePageLimitClick = (pageLimit: number) => setViewPerPage(pageLimit);

    return (
        <div className="flex flex-col gap-4 min-h-[25vh] w-full">
            <div className="overflow-hidden rounded-lg border backdrop-blur-xl bg-white/60 dark:bg-card/60 border-gray-300/60 dark:border-white/20 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.1)] hover:shadow-[0px_12px_48px_0px_rgba(0,0,0,0.15)] transition-all duration-300">
                <Table className="table-fixed">
                    <TableHeader className="bg-muted sticky top-0 z-10">
                        <TableRow>
                            <TableHead>
                                <TableHeaderDropDownMenu
                                    label="Bank"
                                    items={bankAccounts}
                                    selectedItems={selectedBanks}
                                    onItemToggle={handleBankToggle}
                                    onClearAll={handleClearAll}
                                    onSelectAll={handleSelectAll}
                                />
                            </TableHead>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    onClick={() => handleSort("date")}
                                    className="hover:bg-accent h-8 px-2 -ml-2"
                                >
                                    Date
                                    {getSortIcon("date")}
                                </Button>
                            </TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>
                                <TableHeaderDropDownMenu
                                    label="Status"
                                    items={statusTypes}
                                    selectedItems={selectedStatus}
                                    onItemToggle={handleStatusToggle}
                                    onClearAll={handleClearAllStatus}
                                    onSelectAll={handleSelectAllStatus}
                                />
                            </TableHead>
                            <TableHead className="text-right">
                                <Button
                                    variant="ghost"
                                    onClick={() => handleSort("amount")}
                                    className="hover:bg-accent h-8 px-2 -ml-2 ml-auto"
                                >
                                    Amount
                                    {getSortIcon("amount")}
                                </Button>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pagedData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                                        <p className="font-medium">No transactions found</p>
                                        <p className="text-sm">Try adjusting your search or filters</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            pagedData.map((t) => (
                                <TableRow key={t.id}>
                                    <TableCell className="font-medium">{accountMap.get(t.accountId)}</TableCell>
                                    <TableCell>
                                        {new Date(t.date).toLocaleDateString("en-US", {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </TableCell>
                                    <TableCell className="truncate">{t.description}</TableCell>
                                    <TableCell className="truncate">
                                        {t.category}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={cn("w-24 justify-start gap-1.5 text-xs", getStatusBadgeStyles(t.status))}
                                        >
                                            <span className={cn("size-2 rounded-full", getStatusDotColor(t.status))} />
                                            {t.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell
                                        className={cn(
                                            "text-right font-medium tabular-nums",
                                            t.amount < 0 ? "text-destructive" : ""
                                        )}
                                    >
                                        ${Math.abs(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between px-2">
                <div className="text-sm text-muted-foreground">
                    {pagedData.length} of {sortedData.length} row(s) shown
                </div>
                <div className="flex items-center gap-6">
                    <SelectWrapper onChange={handlePageLimitClick} />
                    <PaginationWrapper
                        totalPages={totalPages}
                        currentPage={page}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                        onPageClick={handlePageClick}
                    />
                </div>
            </div>
        </div>
    );
};