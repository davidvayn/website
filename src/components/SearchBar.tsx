"use client";

import { useState, useRef, useEffect } from "react";
import { useSearch } from "@/hooks/useSearch";
import { suggestions } from "@/data/suggestions";

export default function SearchBar() {
  const { query, setQuery } = useSearch();
  const [inputValue, setInputValue] = useState(query);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep inputValue in sync when query changes externally (e.g. suggestion click)
  // Using a key-based reset approach instead of effect setState
  const [lastSyncedQuery, setLastSyncedQuery] = useState(query);
  if (lastSyncedQuery !== query) {
    setLastSyncedQuery(query);
    setInputValue(query);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleInputChange(value: string) {
    setInputValue(value);
    if (value.trim()) {
      const filtered = suggestions.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(suggestions.slice(0, 5));
    }
    setShowSuggestions(true);
  }

  function handleSearch(searchQuery?: string) {
    const q = searchQuery ?? inputValue;
    setQuery(q);
    setInputValue(q);
    setShowSuggestions(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  function handleFocus() {
    const filtered = inputValue.trim()
      ? suggestions.filter((s) =>
          s.toLowerCase().includes(inputValue.toLowerCase())
        )
      : suggestions.slice(0, 5);
    setFilteredSuggestions(filtered);
    setShowSuggestions(true);
  }

  function handleClear() {
    setInputValue("");
    setQuery("");
    inputRef.current?.focus();
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-[692px]">
      <div
        className="flex items-center rounded-full border px-4 py-3 hover:shadow-md transition-shadow"
        style={{
          backgroundColor: "var(--search-bg)",
          borderColor: "var(--search-border)",
        }}
      >
        <svg
          className="w-5 h-5 mr-3 flex-shrink-0"
          style={{ color: "var(--text-secondary)" }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          className="flex-1 outline-none text-base bg-transparent"
          style={{ color: "var(--text)" }}
          aria-label="Search"
        />

        {inputValue && (
          <>
            <button
              onClick={handleClear}
              className="p-1 mx-1 hover:opacity-70"
              style={{ color: "var(--text-secondary)" }}
              aria-label="Clear search"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
            <div
              className="w-px h-6 mx-2"
              style={{ backgroundColor: "var(--border)" }}
            />
          </>
        )}

        <button
          onClick={() => handleSearch()}
          className="p-1 hover:opacity-70"
          aria-label="Search"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285f4"
              d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
            />
          </svg>
        </button>
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-0 rounded-b-3xl border border-t-0 shadow-lg z-50 overflow-hidden"
          style={{
            backgroundColor: "var(--search-bg)",
            borderColor: "var(--search-border)",
          }}
        >
          <div
            className="mx-4 border-t"
            style={{ borderColor: "var(--border)" }}
          />
          {filteredSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSearch(suggestion)}
              className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-[var(--hover-bg)] text-sm"
              style={{ color: "var(--text)" }}
            >
              <svg
                className="w-4 h-4 flex-shrink-0"
                style={{ color: "var(--text-secondary)" }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              {suggestion}
            </button>
          ))}
          <div className="flex justify-center gap-3 py-3">
            <button
              onClick={() => handleSearch()}
              className="px-4 py-2 text-sm rounded"
              style={{
                backgroundColor: "var(--hover-bg)",
                color: "var(--text)",
              }}
            >
              Google Search
            </button>
            <a
              href="/resume.pdf"
              className="px-4 py-2 text-sm rounded"
              style={{
                backgroundColor: "var(--hover-bg)",
                color: "var(--text)",
              }}
            >
              I&apos;m Feeling Lucky
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
