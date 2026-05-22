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
}

const SearchContext = createContext<SearchContextType>({
  query: "",
  setQuery: () => {},
  activeFilter: "all",
  setActiveFilter: () => {},
});

function readSearchState(params: URLSearchParams) {
  return {
    query: params.get("q") || "David Vayntrub",
    activeFilter: params.get("f") || "all",
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

  const { query, activeFilter } = searchState;

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
