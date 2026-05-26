"use client";

import Link from "next/link";
import { useState } from "react";

interface OrganicResultProps {
  title: string;
  url: string;
  href?: string | null;
  snippet: string;
  details: string;
  tags?: string[];
}

export default function OrganicResult({
  title,
  url,
  href,
  snippet,
  details,
  tags,
}: OrganicResultProps) {
  const [expanded, setExpanded] = useState(false);
  const resolvedHref = href ?? `https://${url.split(" › ").join("/")}`;
  const isInternalRoute =
    typeof href === "string" && href.startsWith("/") && !href.includes(".");

  return (
    <div className="mb-6 max-w-[600px]">
      <div className="mb-1">
        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {url}
        </span>
      </div>

      <h3 className="text-xl mb-1 flex items-center group">
        {href === null ? (
          <span style={{ color: "var(--google-blue)" }}>{title}</span>
        ) : isInternalRoute ? (
          <Link
            href={resolvedHref}
            className="hover:underline"
            style={{ color: "var(--google-blue)" }}
          >
            {title}
          </Link>
        ) : (
          <a
            href={resolvedHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            style={{ color: "var(--google-blue)" }}
          >
            {title}
          </a>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-2 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-[var(--hover-bg)] transition-opacity"
          aria-label={expanded ? "Collapse details" : "Expand details"}
          style={{ color: "var(--text-secondary)" }}
        >
          <svg
            className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </h3>

      <p
        className="text-sm leading-6"
        style={{ color: "var(--google-snippet)" }}
        dangerouslySetInnerHTML={{ __html: snippet }}
      />

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: "var(--hover-bg)",
                color: "var(--text-secondary)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {expanded && (
        <div
          className="mt-3 p-3 rounded-lg text-sm leading-6 border"
          style={{
            backgroundColor: "var(--hover-bg)",
            borderColor: "var(--border)",
            color: "var(--google-snippet)",
          }}
        >
          {details}
        </div>
      )}
    </div>
  );
}
