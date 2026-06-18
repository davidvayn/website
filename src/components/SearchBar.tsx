"use client";

import {
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
  useSyncExternalStore,
} from "react";
import { useSearch } from "@/hooks/useSearch";
import { useVoiceSearch } from "@/hooks/useVoiceSearch";
import { suggestions } from "@/data/suggestions";
import { getSearchKeywordCandidates, matchVoiceQuery } from "@/lib/search";

function subscribeToHydration(callback: () => void) {
  queueMicrotask(callback);
  return () => {};
}

function getClientHydrationSnapshot() {
  return true;
}

function getServerHydrationSnapshot() {
  return false;
}

export default function SearchBar() {
  const { query, setQuery } = useSearch();
  const [inputValue, setInputValue] = useState(query);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const voiceCandidates = useMemo(() => getSearchKeywordCandidates(), []);
  const hasHydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep inputValue in sync when query changes externally (e.g. suggestion click)
  // Using a key-based reset approach instead of effect setState
  const [lastSyncedQuery, setLastSyncedQuery] = useState(query);
  if (lastSyncedQuery !== query) {
    setLastSyncedQuery(query);
    if (inputValue === lastSyncedQuery || inputValue === query) {
      setInputValue(query);
    }
  }

  function getFilteredSuggestions(value: string) {
    return value.trim()
      ? suggestions.filter((s) =>
          s.toLowerCase().includes(value.toLowerCase())
        )
      : suggestions.slice(0, 5);
  }

  function prepareSuggestions(value = inputValue) {
    setShowSuggestions(true);
    setFilteredSuggestions(getFilteredSuggestions(value));
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
    prepareSuggestions(value);
  }

  function handleSearch(searchQuery?: string) {
    const q = searchQuery ?? inputValue;
    setQuery(q);
    setInputValue(q);
    setShowSuggestions(false);
  }

  const handleVoiceResult = useCallback(
    (transcript: string) => {
      const matchedQuery = matchVoiceQuery(transcript, voiceCandidates);
      if (!matchedQuery) {
        return;
      }

      setQuery(matchedQuery);
      setInputValue(matchedQuery);
      setShowSuggestions(false);
    },
    [setQuery, voiceCandidates]
  );

  const { isListening, isSupported, message, startListening } = useVoiceSearch({
    onResult: handleVoiceResult,
  });

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  function handleFocus() {
    prepareSuggestions();
  }

  function handleClear() {
    setInputValue("");
    setQuery("");
    inputRef.current?.focus();
  }

  const hasSuggestions = showSuggestions && filteredSuggestions.length > 0;
  const isExpanded = hasHydrated && hasSuggestions;
  const voiceButtonTitle = isSupported
    ? isListening
      ? "Listening for voice search"
      : "Search by voice"
    : "Voice search is not supported in this browser";

  return (
    <div
      ref={containerRef}
      className={`relative w-full min-w-0 rounded-3xl transition-[filter] duration-150 ${
        isExpanded
          ? "z-50 drop-shadow-[0_2px_3px_rgba(32,33,36,0.25)]"
          : "hover:drop-shadow-[0_1px_2px_rgba(32,33,36,0.28)]"
      }`}
    >
      <div
        onPointerDownCapture={() => prepareSuggestions()}
        className={`flex min-w-0 items-center border px-3 py-2 md:px-4 md:py-3 ${
          isExpanded
            ? "rounded-t-3xl rounded-b-none border-b-0"
            : "rounded-full"
        }`}
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
          className="min-w-0 flex-1 outline-none text-base bg-transparent"
          style={{ color: "var(--text)" }}
          aria-label="Search"
        />

        {inputValue && (
          <>
            <button
              onClick={handleClear}
              className="mx-1 flex h-8 w-8 flex-shrink-0 items-center justify-center hover:opacity-70"
              style={{ color: "var(--text-secondary)" }}
              aria-label="Clear search"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
            <div
              className="w-px h-6 mx-1 flex-shrink-0 md:mx-2"
              style={{ backgroundColor: "var(--border)" }}
            />
          </>
        )}

        <button
          type="button"
          onClick={() => {
            setShowSuggestions(false);
            startListening();
          }}
          disabled={!isSupported}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full hover:bg-[var(--hover-bg)] disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={voiceButtonTitle}
          aria-pressed={isListening}
          title={voiceButtonTitle}
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{
              color: isListening ? "#ea4335" : "var(--text-secondary)",
            }}
          >
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17.3 11c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z" />
          </svg>
        </button>

        <button
          onClick={() => handleSearch()}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center hover:opacity-70"
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

      <p className="sr-only" aria-live="polite">
        {message}
      </p>

      {isExpanded && (
        <div
          className="absolute top-full left-0 right-0 z-50 mt-0 overflow-hidden rounded-b-3xl border border-t-0"
          style={{
            backgroundColor: "var(--search-bg)",
            borderColor: "var(--search-border)",
          }}
        >
          <div className="border-t" style={{ borderColor: "var(--border)" }} />
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
          <div className="flex flex-wrap justify-center gap-2 px-3 py-3 md:gap-3">
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
