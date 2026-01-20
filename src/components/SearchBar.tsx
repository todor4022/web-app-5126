"use client";

import { useState } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
    onSearch: (city: string) => void;
    onLocation: () => void;
    isLoading: boolean;
}

export function SearchBar({ onSearch, onLocation, isLoading }: SearchBarProps) {
    const [query, setQuery] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex w-full max-w-lg gap-2">
            <div className="relative flex-1">
                <Input
                    placeholder="Search city..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10 h-12 text-lg rounded-2xl border-2 focus-visible:ring-primary/20"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            </div>
            <Button
                type="submit"
                size="lg"
                className="rounded-2xl h-12 px-6 bg-primary hover:bg-primary/90 transition-all active:scale-95"
                disabled={isLoading}
            >
                {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "Search"}
            </Button>
            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onLocation}
                disabled={isLoading}
                className="rounded-2xl h-12 w-12 border-2 hover:bg-accent transition-all active:scale-95"
                title="Use my location"
            >
                <MapPin className="w-5 h-5" />
            </Button>
        </form>
    );
}
