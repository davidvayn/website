"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchContextType {
  query: string;
  setQuery: (q: string) => void;
  activeFilter: string;
  setActiveFilter: (f: string) => void;
}

const SearchContext = createContext<SearchContextType>({
  query: "",
  setQuery: () => {},
  activeFilter: "all",
  setActiveFilter: () => {},
});

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [query, setQueryState] = useState(searchParams.get("q") || "David Vayntrub");
  const [activeFilter, setActiveFilterState] = useState(searchParams.get("f") || "all");

  const setQuery = useCallback((q: string) => {
    setQueryState(q);
    const params = new URLSearchParams(searchParams.toString());
    if (q) {
      params.set("q", q);
    } else {
      params.delete("q");
    }
    router.push(`/?${params.toString()}`);
  }, [router, searchParams]);

  const setActiveFilter = useCallback((f: string) => {
    setActiveFilterState(f);
    const params = new URLSearchParams(searchParams.toString());
    params.set("f", f);
    router.push(`/?${params.toString()}`);
  }, [router, searchParams]);

  // Sync state with URL changes (e.g. back/forward button)
  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null && q !== query) {
      setQueryState(q);
    }
    const f = searchParams.get("f");
    if (f !== null && f !== activeFilter) {
      setActiveFilterState(f);
    }
  }, [searchParams, query, activeFilter]);

  return (
    <SearchContext.Provider
      value={{ query, setQuery, activeFilter, setActiveFilter }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}
