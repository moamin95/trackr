import { useState, useEffect } from 'react';
import { Input } from "./ui/input";

export const SearchInput = ({ searchQuery, onChange }: { searchQuery: string, onChange: (value: string) => void }) => {

    return (<Input className=""
        placeholder="Search transactions" value={searchQuery} onChange={(e) => onChange(e.target.value)}></Input>)
}


export const useDebounce = (query: string, delay: number = 500) => {
    const [debouncedQuery, setDebouncedQuery] = useState(query);
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query)
        }, delay)
        return () => clearTimeout(timer);
    }, [query, delay])

    return debouncedQuery
}