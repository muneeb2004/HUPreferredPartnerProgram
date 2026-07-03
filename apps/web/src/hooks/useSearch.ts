import { useState, useEffect, useCallback } from 'react';
import { trackEvent } from '../lib/analytics/analytics';

export interface SearchResultItem {
  type: 'partner' | 'offer';
  id: string;
  title: string;
  description?: string;
  status: string;
  featured?: boolean;
  slug?: string;
  createdAt: string;
  relevance?: number;
}

export interface SearchResponse {
  data: SearchResultItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AutocompleteItem {
  type: 'partner' | 'offer';
  id: string;
  title: string;
  url: string;
}

export interface AutocompleteResponse {
  data: AutocompleteItem[];
}

export interface UseSearchOptions {
  debounceMs?: number;
  limit?: number;
}

export function useSearch(initialQuery: string = '', options: UseSearchOptions = {}) {
  const { debounceMs = 300, limit = 10 } = options;
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [suggestions, setSuggestions] = useState<AutocompleteItem[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Use AbortController to cancel previous requests
  useEffect(() => {
    if (!query || query.trim().length === 0) {
      setResults(null);
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const abortController = new AbortController();
    setIsLoading(true);
    setIsError(false);
    setError(null);

    const fetchData = async () => {
      try {
        const searchParams = new URLSearchParams({
          q: query.trim(),
          limit: limit.toString(),
        });

        // We fetch autocomplete or search depending on need, let's fetch full search.
        // If we want just autocomplete suggestions, we can ping /autocomplete.
        // For a unified hook, we might fetch both or let the component choose.
        // Let's fetch autocomplete if < 3 chars, or full search if >= 3
        
        if (query.trim().length >= 2) {
           const acRes = await fetch(`/api/v1/search/autocomplete?${searchParams.toString()}`, {
             signal: abortController.signal,
           });
           if (acRes.ok) {
             const acJson = (await acRes.json()) as AutocompleteResponse;
             setSuggestions(acJson.data);
           }
        }

        const startTime = Date.now();
        const res = await fetch(`/api/v1/search?${searchParams.toString()}`, {
          signal: abortController.signal,
        });

        if (!res.ok) {
          throw new Error('Search failed');
        }

        const json = (await res.json()) as SearchResponse;
        setResults(json);

        // Track Search Analytics
        trackEvent({
          eventType: 'SEARCH_QUERY',
          metadata: {
            searchQuery: query.trim(),
            resultsReturned: json.meta.total,
            duration: Date.now() - startTime,
            zeroResultCount: json.meta.total === 0 ? 1 : 0,
          },
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setIsError(true);
          setError(err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    const handler = setTimeout(() => {
      fetchData();
    }, debounceMs);

    return () => {
      clearTimeout(handler);
      abortController.abort();
    };
  }, [query, debounceMs, limit]);

  return {
    query,
    setQuery,
    results: results?.data || [],
    meta: results?.meta || null,
    suggestions,
    isLoading,
    isError,
    error,
    isEmpty: !isLoading && results?.data.length === 0 && query.trim().length > 0,
  };
}
