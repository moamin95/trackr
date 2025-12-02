import * as React from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
export function SelectWrapper({ onChange }: { onChange: (pageLimit: number) => void }) {

    const limitPerPage = [10, 20, 50, 100]

    const handleChange = (value: number) => onChange(value)

    return (
        <Select onValueChange={(value) => handleChange(Number(value))}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Per Page" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Rows</SelectLabel>
                    {limitPerPage.map((option) => <SelectItem key={option} value={option + ""}>{option}</SelectItem>)}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}