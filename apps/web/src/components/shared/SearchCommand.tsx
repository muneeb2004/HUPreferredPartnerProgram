"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@hu-partner/ui";
import { useSearch } from "../../hooks/useSearch";
import { SearchResultCard } from "./SearchResultCard";
import { SearchEmptyState } from "./SearchEmptyState";
import { SearchSkeleton } from "./SearchSkeleton";

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { query, setQuery, results, isLoading, isError, isEmpty, suggestions } = useSearch("", { limit: 5 });
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const totalItems = suggestions.length + results.length;

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, results, suggestions]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (totalItems === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % totalItems);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + totalItems) % totalItems);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setSelectedIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setSelectedIndex(totalItems - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex < suggestions.length) {
        const suggestion = suggestions[selectedIndex];
        if (suggestion) handleNavigate(suggestion.url);
      } else {
        const res = results[selectedIndex - suggestions.length];
        if (res) {
          const url = res.type === 'partner' ? `/partners/${res.slug}` : `/offers/${res.id}`;
          handleNavigate(url);
        }
      }
    }
  };

  // Auto focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else if (!open) {
      setQuery("");
    }
  }, [open, setQuery]);

  const handleNavigate = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-muted/50 rounded-md border border-border hover:bg-muted transition-colors w-full max-w-[300px]"
      >
        <Search className="w-4 h-4" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 font-mono text-[10px] font-medium rounded border bg-background">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 overflow-hidden max-w-2xl gap-0 border-0 bg-background/95 backdrop-blur-md shadow-2xl">
          <div className="flex items-center border-b px-4 py-3">
            <Search className="w-5 h-5 text-muted-foreground mr-3" />
            <input
              ref={inputRef}
              type="text"
              className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground text-foreground"
              placeholder="Search partners, offers..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {isLoading && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground ml-3" />}
            {query && !isLoading && (
              <button onClick={() => setQuery("")} className="ml-3 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-4 flex flex-col gap-2">
            {!query ? (
              <div className="text-center py-10 text-muted-foreground">
                <p className="text-sm">Type to search for partners and offers...</p>
              </div>
            ) : isLoading && results.length === 0 ? (
              <SearchSkeleton />
            ) : isError ? (
              <div className="text-center py-10 text-destructive">
                <p className="text-sm">An error occurred while searching.</p>
              </div>
            ) : isEmpty ? (
              <SearchEmptyState query={query} />
            ) : (
              <div className="flex flex-col gap-4">
                {/* Autocomplete Suggestions */}
                {suggestions.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Suggestions</h3>
                    <ul className="flex flex-col gap-1">
                      {suggestions.map((s, index) => {
                        const globalIndex = index;
                        return (
                          <li key={`${s.type}-${s.id}`}>
                            <button
                              onClick={() => handleNavigate(s.url)}
                              onMouseEnter={() => setSelectedIndex(globalIndex)}
                              className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between ${selectedIndex === globalIndex ? 'bg-muted ring-1 ring-primary' : 'hover:bg-muted'}`}
                            >
                              <span>{s.title}</span>
                              <span className="text-xs text-muted-foreground capitalize">{s.type}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                
                {/* Full Results */}
                {results.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Results</h3>
                    <div className="flex flex-col gap-2">
                      {results.map((result, index) => {
                        const globalIndex = suggestions.length + index;
                        return (
                          <div
                            key={`${result.type}-${result.id}`}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={selectedIndex === globalIndex ? 'ring-2 ring-primary rounded-lg' : ''}
                          >
                            <SearchResultCard
                              result={result}
                              onSelect={() => {
                                const url = result.type === 'partner' 
                                  ? `/partners/${result.slug}`
                                  : `/offers/${result.id}`;
                                handleNavigate(url);
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
