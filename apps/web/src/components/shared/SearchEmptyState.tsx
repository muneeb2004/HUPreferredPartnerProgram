import React from "react";
import { Search } from "lucide-react";

interface SearchEmptyStateProps {
  query: string;
}

export function SearchEmptyState({ query }: SearchEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center px-4">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <Search className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-lg mb-1">No results found</h3>
      <p className="text-muted-foreground text-sm max-w-sm">
        We couldn't find anything matching "{query}". Try adjusting your search or check for typos.
      </p>
    </div>
  );
}
