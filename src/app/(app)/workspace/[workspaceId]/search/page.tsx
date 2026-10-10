"use client";

import React, { useState, useEffect, use } from "react";
import { searchMessages, SearchResult } from "@/features/ai-assistant/api";
import { SearchResults } from "@/features/ai-assistant/components/SearchResults";
import { Search, X, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function SearchPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const resolvedParams = use(params);
  const { workspaceId } = resolvedParams;
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(Boolean(initialQuery));
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchQuery: string) => {
    const q = searchQuery.trim();
    if (!q) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const data = await searchMessages(workspaceId, q);
      setResults(data);
    } catch (err: any) {
      console.error("Search error", err);
      setError(err?.message || "Failed to search messages");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--color-bg)] overflow-y-auto">
      {/* Top Header */}
      <header className="px-6 py-5 border-b border-[var(--color-border)] bg-[var(--color-surface)] shrink-0 shadow-xs">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-[var(--color-ink)] font-[var(--font-headline)] flex items-center gap-2">
                <Search className="w-5 h-5 text-[var(--color-primary)]" />
                <span>Search Messages</span>
              </h1>
              <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">
                Powered by Gemini embeddings (pgvector cosine search) with keyword fallback.
              </p>
            </div>
          </div>

          {/* Search Input Bar */}
          <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[var(--color-ink-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search across all joined channels by topic or keyword..."
                autoFocus
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm text-[var(--color-ink)] placeholder-[var(--color-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setResults([]);
                    setHasSearched(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] p-1 rounded-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-4 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-xs font-semibold hover:opacity-90 disabled:opacity-40 transition shadow-xs cursor-pointer shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6">
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 text-xs text-[var(--color-danger)]">
            {error}
          </div>
        )}

        <SearchResults
          results={results}
          workspaceId={workspaceId}
          query={query}
          isLoading={isLoading}
          hasSearched={hasSearched}
        />
      </main>
    </div>
  );
}
