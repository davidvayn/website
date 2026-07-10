"use client";

import type { ResolvedLink } from "@/lib/links";

/** A friendly, protocol-free rendering of the destination for the preview. */
function displayUrl(url: string): string {
  if (url.startsWith("mailto:")) return url.slice("mailto:".length);
  if (url.startsWith("/")) return url;
  try {
    const u = new URL(url);
    return (u.hostname + u.pathname).replace(/\/$/, "");
  } catch {
    return url;
  }
}

/**
 * A resolved link rendered inside the AI Overview, either as inline prose text
 * ("inline") or as a Source pill ("chip"). Both share an emoji cue and a hover
 * (and keyboard-focus) preview card that shows the destination — with the
 * project thumbnail when one exists.
 */
export default function OverviewLink({
  link,
  label,
  variant,
}: {
  link: ResolvedLink;
  label: string;
  variant: "inline" | "chip";
}) {
  const anchorProps = link.external
    ? { href: link.url, target: "_blank", rel: "noopener noreferrer" }
    : { href: link.url };

  const anchorClass =
    variant === "chip"
      ? "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs hover:underline"
      : "hover:underline";

  const anchorStyle =
    variant === "chip"
      ? { backgroundColor: "var(--hover-bg)", color: "var(--google-blue)" }
      : { color: "var(--google-blue)" };

  return (
    <span className="group/link relative inline-block">
      <a {...anchorProps} className={anchorClass} style={anchorStyle}>
        {label}
      </a>

      <span
        role="tooltip"
        className="pointer-events-none absolute left-0 top-full z-50 mt-1.5 hidden w-64 overflow-hidden rounded-xl border text-left shadow-lg group-hover/link:block group-focus-within/link:block"
        style={{
          backgroundColor: "var(--search-bg)",
          borderColor: "var(--search-border, var(--border))",
        }}
      >
        {link.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={link.image}
            alt=""
            className="h-28 w-full object-cover"
            style={{ backgroundColor: "var(--hover-bg)" }}
          />
        )}
        <span className="block p-3">
          <span
            className="block text-sm font-medium"
            style={{ color: "var(--text)" }}
          >
            {link.label}
          </span>
          {link.description && (
            <span
              className="mt-0.5 block text-xs leading-snug"
              style={{ color: "var(--text-secondary)" }}
            >
              {link.description}
            </span>
          )}
          <span
            className="mt-1.5 block truncate text-xs"
            style={{ color: "var(--google-blue)" }}
          >
            {displayUrl(link.url)}
          </span>
        </span>
      </span>
    </span>
  );
}
