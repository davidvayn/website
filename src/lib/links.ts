import { projects } from "@/data/projects";
import { experiences } from "@/data/experiences";
import { links } from "@/data/links";

export interface ResolvedLink {
  id: string;
  label: string;
  url: string;
  /** True when the link leaves the site (opened in a new tab with rel guards). */
  external: boolean;
  /** Optional thumbnail (public path) shown in the hover preview. */
  image?: string;
  /** Optional one-line subtitle shown in the hover preview. */
  description?: string;
}

function stripTags(text: string): string {
  return text.replace(/<[^>]+>/g, "");
}

/**
 * Only these forms are ever turned into a live link. This is the last line of
 * defense: even though the registry is built entirely from owner-controlled
 * data, the resolved URL is rendered into an `<a href>` inside AI Overview
 * output, so we refuse anything that isn't a plain web/mail link or a
 * root-relative site path (blocks `javascript:`, `data:`, etc.).
 */
function isSafeUrl(url: string): boolean {
  if (url.startsWith("/")) return true; // internal, root-relative path
  try {
    const scheme = new URL(url).protocol;
    return scheme === "https:" || scheme === "http:" || scheme === "mailto:";
  } catch {
    return false;
  }
}

function isExternal(url: string): boolean {
  return !url.startsWith("/");
}

/**
 * A single id → link registry merging projects, experiences, and the standalone
 * links list. Built once at module load. The model references these ids in the
 * corpus; `resolveLink` maps them back to real URLs. Ids the model invents (or
 * that resolve to an unsafe URL) simply aren't in the map, so they render as
 * plain text instead of a link.
 */
const registry: Map<string, ResolvedLink> = (() => {
  const map = new Map<string, ResolvedLink>();

  const add = (
    id: string,
    label: string,
    url: string | undefined,
    extra?: { image?: string; description?: string },
  ) => {
    if (!id || !url || !isSafeUrl(url)) return;
    map.set(id, {
      id,
      label,
      url,
      external: isExternal(url),
      image: extra?.image,
      description: extra?.description,
    });
  };

  for (const p of projects)
    add(p.id, p.title, p.href ?? undefined, {
      image: p.image,
      description: stripTags(p.snippet),
    });
  for (const e of experiences)
    add(e.id, e.title, e.href ?? undefined, {
      description: stripTags(e.snippet),
    });
  for (const l of links)
    add(l.id, l.label, l.url, { description: l.description });

  return map;
})();

export function resolveLink(id: string): ResolvedLink | undefined {
  return registry.get(id.trim());
}

/** All ids the corpus is allowed to advertise to the model. */
export function linkableIds(): string[] {
  return [...registry.keys()];
}
