"use client"

import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type TableHeaderDropDownMenuProps = {
    label: string;
    items: Set<string>;
    selectedItems: Set<string>;
    onItemToggle: (item: string) => void;
    onClearAll: () => void;
    onSelectAll: () => void;
}

export function TableHeaderDropDownMenu({
    label,
    items,
    selectedItems,
    onItemToggle,
    onClearAll,
    onSelectAll
}: TableHeaderDropDownMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2 -ml-2">
                    {label}
                    <Filter className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Filter by {label}</span>
                    {selectedItems.size > 0 && (
                        <span className="text-xs text-muted-foreground">
                            {selectedItems.size} selected
                        </span>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="px-2 py-2">
                    <div className="flex items-center gap-2 mb-3">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs flex-1"
                            onClick={onSelectAll}
                        >
                            Select All
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs flex-1"
                            onClick={onClearAll}
                        >
                            Clear
                        </Button>
                    </div>
                    <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto">
                        {[...items].sort().map((item) => (
                            <div key={item} className="flex items-center gap-3">
                                <Checkbox
                                    id={`${label}-${item}`}
                                    checked={selectedItems.has(item)}
                                    onCheckedChange={() => onItemToggle(item)}
                                />
                                <Label
                                    htmlFor={`${label}-${item}`}
                                    className="cursor-pointer flex-1 text-sm"
                                >
                                    {item}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


