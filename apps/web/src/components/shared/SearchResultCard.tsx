import React from "react";
import { Badge } from "@hu-partner/ui";
import { SearchResultItem } from "../../hooks/useSearch";
import { Store, Tag } from "lucide-react";

interface SearchResultCardProps {
  result: SearchResultItem;
  onSelect: () => void;
}

export function SearchResultCard({ result, onSelect }: SearchResultCardProps) {
  return (
    <button
      onClick={onSelect}
      className="flex flex-col text-left p-3 rounded-lg border border-border/50 bg-card hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      <div className="flex items-start justify-between w-full mb-1">
        <div className="flex items-center gap-2">
          {result.type === "partner" ? (
            <Store className="w-4 h-4 text-primary" />
          ) : (
            <Tag className="w-4 h-4 text-green-500" />
          )}
          <span className="font-semibold text-sm">{result.title}</span>
        </div>
        {result.featured && (
          <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
            Featured
          </Badge>
        )}
      </div>
      
      {result.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
          {result.description}
        </p>
      )}
      
      <div className="flex items-center gap-2 mt-2">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium bg-muted px-1.5 py-0.5 rounded">
          {result.type}
        </span>
        {result.status === "PUBLISHED" ? (
          <span className="text-[10px] text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded">Active</span>
        ) : (
          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{result.status}</span>
        )}
      </div>
    </button>
  );
}
