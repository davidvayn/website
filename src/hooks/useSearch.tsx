"use client";

import { createContext, useContext, useCallback } from "react";
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
  
  const query = searchParams.get("q") || "David Vayntrub";
  const activeFilter = searchParams.get("f") || "all";

  const setQuery = useCallback((q: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (q) {
      params.set("q", q);
    } else {
      params.delete("q");
    }
    router.push(`/?${params.toString()}`);
  }, [router, searchParams]);

  const setActiveFilter = useCallback((f: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("f", f);
    router.push(`/?${params.toString()}`);
  }, [router, searchParams]);

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
