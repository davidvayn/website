"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { resolveLink, type ResolvedLink } from "@/lib/links";
import OverviewLink from "@/components/OverviewLink";

// Matches a complete link token: [visible text](id). The model is instructed to
// emit these (see src/lib/corpus.ts). Ids are resolved against our own registry,
// so a token whose id we don't recognize is dropped to plain text.
const LINK_TOKEN = /\[([^\]\n]+)\]\(([^)\s]+)\)/g;

/**
 * Parse accumulated overview text into inline React nodes, resolving link
 * tokens to real anchors and collecting the deduped set of sources referenced.
 * We parse the whole accumulated string each render (not per-chunk), so a token
 * split across stream chunks just completes on a later render. While still
 * streaming, a half-typed trailing token is hidden until it closes.
 */
function parseOverview(
  text: string,
  loading: boolean,
): { nodes: ReactNode[]; sources: ResolvedLink[] } {
  const nodes: ReactNode[] = [];
  const sources = new Map<string, ResolvedLink>();
  let lastIndex = 0;
  let key = 0;

  LINK_TOKEN.lastIndex = 0;
  for (let m = LINK_TOKEN.exec(text); m; m = LINK_TOKEN.exec(text)) {
    const [full, label, id] = m;
    if (m.index > lastIndex) nodes.push(text.slice(lastIndex, m.index));
    lastIndex = m.index + full.length;

    const link = resolveLink(id);
    if (link) {
      sources.set(link.id, link);
      nodes.push(
        <OverviewLink
          key={`l${key++}`}
          link={link}
          label={label}
          variant="inline"
        />,
      );
    } else {
      // Unknown/invented id — never render a live link; keep the visible words.
      nodes.push(label);
    }
  }

  let tail = text.slice(lastIndex);
  // Hide a partially-streamed token (an unclosed "[…") so brackets don't flash.
  if (loading) {
    const open = tail.indexOf("[");
    if (open !== -1) tail = tail.slice(0, open);
  }
  if (tail) nodes.push(tail);

  return { nodes, sources: [...sources.values()] };
}

export default function AiOverview({
  query,
  staticAnswer,
}: {
  query: string;
  /** When set, render this text immediately with no API call (used for the
      default landing query so every visit is instant and free). */
  staticAnswer?: string;
}) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!query.trim()) return;

    // Pre-written overview (e.g. the default landing query): show instantly,
    // no fetch.
    if (staticAnswer) {
      abortRef.current?.abort();
      setErrorMessage("");
      setText(staticAnswer);
      setStatus("done");
      return;
    }

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
  }, [query, staticAnswer]);

  if (status === "idle") return null;

  const { nodes, sources } = parseOverview(text, status === "loading");

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
          {nodes}
          {status === "loading" && (
            <span className="ml-0.5 inline-block animate-pulse">▍</span>
          )}
        </p>
      )}

      {status !== "error" && sources.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span
            className="text-xs font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            Sources
          </span>
          {sources.map((s) => (
            <OverviewLink key={s.id} link={s} label={s.label} variant="chip" />
          ))}
        </div>
      )}

      <p className="mt-3 text-xs" style={{ color: "var(--text-secondary)" }}>
        AI-generated overview
      </p>
    </div>
  );
}
