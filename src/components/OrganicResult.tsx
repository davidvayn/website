"use client";

import { useState } from "react";

interface OrganicResultProps {
  title: string;
  url: string;
  snippet: string;
  details: string;
  tags?: string[];
}

export default function OrganicResult({
  title,
  url,
  snippet,
  details,
  tags,
}: OrganicResultProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-6 max-w-[600px]">
      <div className="mb-1">
        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {url}
        </span>
      </div>

      <h3 className="text-xl mb-1">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-left hover:underline cursor-pointer"
          style={{ color: "var(--google-blue)" }}
        >
          {title}
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
