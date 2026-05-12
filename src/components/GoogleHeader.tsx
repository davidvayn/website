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
      <div className="flex items-center gap-6 px-6 lg:px-8 pb-3">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight flex-shrink-0"
          style={{ fontFamily: "'Product Sans', arial, sans-serif" }}
        >
          <span style={{ color: "#4285f4" }}>D</span>
          <span style={{ color: "#ea4335" }}>v</span>
          <span style={{ color: "#fbbc05" }}>a</span>
          <span style={{ color: "#4285f4" }}>y</span>
          <span style={{ color: "#34a853" }}>n</span>
        </Link>

        <div className="flex-1 max-w-[692px]">
          <SearchBar />
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={toggle}
            className="p-2 rounded-full hover:bg-[var(--hover-bg)] transition-colors"
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
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
            style={{ backgroundColor: "#4285f4" }}
            title="David Vayntrub"
          >
            DV
          </div>
        </div>
      </div>

      <nav className="flex gap-1 px-6 lg:px-[180px]">
        {NAV_TABS.map((tab) => (
          <button
            key={tab.filter}
            onClick={() => setActiveFilter(tab.filter)}
            className={`flex items-center gap-1 px-3 py-2 text-sm border-b-[3px] transition-colors ${
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
