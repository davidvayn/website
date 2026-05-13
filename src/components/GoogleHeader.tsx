"use client";

import Link from "next/link";
import { useSearch } from "@/hooks/useSearch";
import { useDarkMode } from "@/hooks/useDarkMode";
import SearchBar from "./SearchBar";

const NAV_TABS = [
  { label: "All", filter: "all", icon: "M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" },
  { label: "Images", filter: "images", icon: "M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" },
  { label: "Videos", filter: "videos", icon: "M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" },
  { label: "News", filter: "news", icon: "M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z" },
];

export default function GoogleHeader() {
  const { activeFilter, setActiveFilter } = useSearch();
  const { isDark, toggle } = useDarkMode();

  return (
    <header
      className="sticky top-0 z-40 border-b pt-4 pb-0"
      style={{
        backgroundColor: "var(--bg)",
        borderColor: "var(--border)",
      }}
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-3 gap-y-3 px-4 pb-3 md:grid-cols-[1fr_minmax(0,820px)_1fr] md:px-6 lg:px-8">
        <div className="desktop-header-search-group contents md:col-span-1 md:col-start-2 md:flex md:min-w-0 md:items-center md:gap-x-6">
          <Link
            href="/"
            className="col-start-2 row-start-1 text-xl md:text-2xl font-bold tracking-tight flex-shrink-0 md:col-auto md:row-auto"
            style={{ fontFamily: "'Product Sans', arial, sans-serif" }}
          >
            <span style={{ color: "#4285f4" }}>D</span>
            <span style={{ color: "#ea4335" }}>v</span>
            <span style={{ color: "#fbbc05" }}>a</span>
            <span style={{ color: "#4285f4" }}>y</span>
            <span style={{ color: "#34a853" }}>n</span>
          </Link>

          <div className="col-span-3 row-start-2 min-w-0 md:col-auto md:row-auto md:flex-1 md:max-w-[692px]">
            <SearchBar />
          </div>
        </div>

        <div className="z-10 col-start-3 row-start-1 flex flex-shrink-0 items-center justify-self-end gap-2 md:gap-3">
          <button
            onClick={toggle}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full hover:bg-[var(--hover-bg)] transition-colors"
            aria-label="Toggle dark mode"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <svg className="w-5 h-5" style={{ color: "var(--text-secondary)" }} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" style={{ color: "var(--text-secondary)" }} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
              </svg>
            )}
          </button>

          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "var(--hover-bg)" }}
            title="David Vayntrub"
          >
            <svg
              className="w-5 h-5"
              style={{ color: "var(--text-secondary)" }}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>
      </div>

      <nav className="flex max-w-full min-w-0 gap-0 px-3 md:gap-1 md:px-6 lg:px-[180px]">
        {NAV_TABS.map((tab) => (
          <button
            key={tab.filter}
            onClick={() => setActiveFilter(tab.filter)}
            className={`flex min-w-0 items-center gap-1 whitespace-nowrap px-2 py-2 text-sm border-b-[3px] transition-colors md:px-3 ${
              activeFilter === tab.filter
                ? "border-[#4285f4]"
                : "border-transparent hover:border-[var(--text-secondary)]"
            }`}
            style={{
              color:
                activeFilter === tab.filter
                  ? "#4285f4"
                  : "var(--text-secondary)",
            }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
