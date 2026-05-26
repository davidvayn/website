"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";

interface SearchContextType {
  query: string;
  setQuery: (q: string) => void;
  activeFilter: string;
  setActiveFilter: (f: string) => void;
  resetSearch: () => void;
}

const SearchContext = createContext<SearchContextType>({
  query: "",
  setQuery: () => {},
  activeFilter: "all",
  setActiveFilter: () => {},
  resetSearch: () => {},
});

const SUPPORTED_FILTERS = new Set(["all", "images", "blog"]);

function readSearchState(params: URLSearchParams) {
  const filter = params.get("f") || "all";

  return {
    query: params.get("q") || "David Vayntrub",
    activeFilter: SUPPORTED_FILTERS.has(filter) ? filter : "all",
  };
}

function pushSearchParams(params: URLSearchParams) {
  const queryString = params.toString();
  window.history.pushState(null, "", queryString ? `/?${queryString}` : "/");
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const [searchState, setSearchState] = useState(() =>
    readSearchState(searchParams)
  );

  useEffect(() => {
    function handlePopState() {
      setSearchState(
        readSearchState(new URLSearchParams(window.location.search))
      );
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const setQuery = useCallback((q: string) => {
    const params = new URLSearchParams(window.location.search);
    if (q) {
      params.set("q", q);
    } else {
      params.delete("q");
    }
    pushSearchParams(params);
    setSearchState(readSearchState(params));
  }, []);

  const setActiveFilter = useCallback((f: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("f", f);
    pushSearchParams(params);
    setSearchState(readSearchState(params));
  }, []);

  const resetSearch = useCallback(() => {
    window.history.pushState(null, "", "/");
    setSearchState({ query: "David Vayntrub", activeFilter: "all" });
  }, []);

  const { query, activeFilter } = searchState;

  return (
    <SearchContext.Provider
      value={{ query, setQuery, activeFilter, setActiveFilter, resetSearch }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}
