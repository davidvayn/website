"use client";

import { useEffect, useRef, useState } from "react";

export default function AiOverview({ query }: { query: string }) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!query.trim()) return;

    // Cancel any in-flight request when the query changes.
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setText("");
    setErrorMessage("");
    setStatus("loading");

    (async () => {
      try {
        const res = await fetch("/api/ai-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error ?? "AI search is unavailable right now.");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let streamed = false;
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          streamed = true;
          setText((prev) => prev + decoder.decode(value, { stream: true }));
        }
        setStatus(streamed ? "done" : "error");
        if (!streamed) setErrorMessage("AI search is unavailable right now.");
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setErrorMessage((err as Error).message);
        setStatus("error");
      }
    })();

    return () => controller.abort();
  }, [query]);

  if (status === "idle") return null;

  return (
    <div
      className="mb-6 rounded-2xl border p-4"
      style={{
        backgroundColor: "var(--search-bg)",
        borderColor: "var(--search-border, var(--border))",
      }}
    >
      <div className="mb-2 flex items-center gap-2">
        <svg
          className="h-4 w-4 flex-shrink-0"
          viewBox="0 0 24 24"
          fill="#4285f4"
          aria-hidden="true"
        >
          <path d="M12 2l1.9 5.7L19.5 9l-4.5 3.3L16.5 18 12 14.7 7.5 18l1.5-5.7L4.5 9l5.6-1.3L12 2z" />
        </svg>
        <span
          className="text-sm font-medium"
          style={{ color: "var(--text)" }}
        >
          AI Overview
        </span>
      </div>

      {status === "error" ? (
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {errorMessage || "AI search is unavailable right now."}
        </p>
      ) : status === "loading" && !text ? (
        <div className="space-y-2" aria-label="Generating AI overview">
          <div
            className="h-3 w-full animate-pulse rounded"
            style={{ backgroundColor: "var(--hover-bg)" }}
          />
          <div
            className="h-3 w-11/12 animate-pulse rounded"
            style={{ backgroundColor: "var(--hover-bg)" }}
          />
          <div
            className="h-3 w-3/5 animate-pulse rounded"
            style={{ backgroundColor: "var(--hover-bg)" }}
          />
        </div>
      ) : (
        <p
          className="whitespace-pre-wrap text-base leading-relaxed"
          style={{ color: "var(--text)" }}
          aria-live="polite"
        >
          {text}
          {status === "loading" && (
            <span className="ml-0.5 inline-block animate-pulse">▍</span>
          )}
        </p>
      )}

      <p className="mt-3 text-xs" style={{ color: "var(--text-secondary)" }}>
        AI-generated overview 
      </p>
    </div>
  );
}
