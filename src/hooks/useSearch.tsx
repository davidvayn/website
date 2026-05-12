"use client";

import { createContext, useContext, useState, useCallback } from "react";

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
  const [query, setQueryState] = useState("David Vayntrub");
  const [activeFilter, setActiveFilter] = useState("all");

  const setQuery = useCallback((q: string) => {
    setQueryState(q);
  }, []);

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
