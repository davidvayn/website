"use client";

import { useEffect, useState, type ReactNode } from "react";
import { resolveLink, type ResolvedLink } from "@/lib/links";
import OverviewLink from "@/components/OverviewLink";

// Matches a complete link token: [visible text](id). The model is instructed to
// emit these (see src/lib/corpus.ts). Ids are resolved against our own registry,
// so a token whose id we don't recognize is dropped to plain text.
const LINK_TOKEN = /\[([^\]\n]+)\]\(([^)\s]+)\)/g;

// Session-scoped cache of completed overviews, keyed by query. This component
// unmounts when the user leaves the "all" tab, so without a cache, returning to
// it would re-stream (and re-animate, and re-bill) the same answer. Instead the
// answer is streamed once, stored here, and restored instantly on remount or
// when the same query is searched again. Lives for the page session only.
const overviewCache = new Map<string, string>();

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

type OverviewStatus = "idle" | "loading" | "done" | "error";

// An answer we can render WITHOUT a network request: the pre-written static
// overview, or a previously-streamed answer cached this session (e.g. after a
// tab switch). Returns undefined when the query must be fetched live.
function resolveImmediate(
  query: string,
  staticAnswer?: string,
): string | undefined {
  if (!query.trim()) return undefined;
  if (staticAnswer) return staticAnswer;
  return overviewCache.get(query);
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
  const immediate = resolveImmediate(query, staticAnswer);
  const needsFetch = !immediate && query.trim().length > 0;

  // Fetch-path state — only meaningful when there's no immediate answer. It's
  // reset during render (not in an effect) when a new query needs a live fetch,
  // following React's "adjust state when a prop changes" pattern, so the effect
  // below stays purely for the async request and never calls setState in its
  // body.
  const [fetchedFor, setFetchedFor] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<OverviewStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (needsFetch && fetchedFor !== query) {
    setFetchedFor(query);
    setText("");
    setErrorMessage("");
    setStatus("loading");
  }

  useEffect(() => {
    if (!needsFetch) return;

    // Cancels the in-flight request when the query changes or on unmount.
    const controller = new AbortController();

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
        let full = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          full += chunk;
          setText((prev) => prev + chunk);
        }
        if (full) {
          // Cache the completed answer so future remounts skip the round trip.
          overviewCache.set(query, full);
          setStatus("done");
        } else {
          setStatus("error");
          setErrorMessage("AI search is unavailable right now.");
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setErrorMessage((err as Error).message);
        setStatus("error");
      }
    })();

    return () => controller.abort();
  }, [query, needsFetch]);

  const displayStatus: OverviewStatus = immediate ? "done" : status;
  const displayText = immediate ?? text;

  if (displayStatus === "idle") return null;

  const { nodes, sources } = parseOverview(
    displayText,
    displayStatus === "loading",
  );

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

      {displayStatus === "error" ? (
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {errorMessage || "AI search is unavailable right now."}
        </p>
      ) : displayStatus === "loading" && !displayText ? (
        <div className="space-y-2" aria-label="Generating AI overview">
          <div
            className="h-3 w-full animate-pulse rounded"
            style={{ backgroundColor: "var(--skeleton-bg)" }}
          />
          <div
            className="h-3 w-11/12 animate-pulse rounded"
            style={{ backgroundColor: "var(--skeleton-bg)" }}
          />
          <div
            className="h-3 w-3/5 animate-pulse rounded"
            style={{ backgroundColor: "var(--skeleton-bg)" }}
          />
        </div>
      ) : (
        <p
          className="whitespace-pre-wrap text-base leading-relaxed"
          style={{ color: "var(--text)" }}
          aria-live="polite"
        >
          {nodes}
          {displayStatus === "loading" && (
            <span className="ml-0.5 inline-block animate-pulse">▍</span>
          )}
        </p>
      )}

      {displayStatus !== "error" && sources.length > 0 && (
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
