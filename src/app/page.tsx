"use client";

import { useMemo, Suspense } from "react";
import { SearchProvider, useSearch } from "@/hooks/useSearch";
import GoogleHeader from "@/components/GoogleHeader";
import AiOverview from "@/components/AiOverview";
import SponsoredResult from "@/components/SponsoredResult";
import OrganicResult from "@/components/OrganicResult";
import PeopleAlsoAsk from "@/components/PeopleAlsoAsk";
import ImagesRow from "@/components/ImagesRow";
import KnowledgePanel from "@/components/KnowledgePanel";
import Pagination from "@/components/Pagination";
import GeoFooter from "@/components/GeoFooter";
import { projects } from "@/data/projects";
import { experiences } from "@/data/experiences";
import { blogPosts } from "@/data/blogs";
import { searchItems } from "@/lib/search";

const DEFAULT_QUERY = "David Vayntrub";

// Pre-written AI Overview for the default landing query. Shown instantly with
// no API call (the answer is the same for every visitor, so there's no reason
// to pay/wait for a live generation). Edit this freely.
const DEFAULT_OVERVIEW =
  "David Vayntrub is a Computer Science student at UC Riverside (graduating in 2027) focused on full-stack development, AI integration, and real-time systems. He cofounded Study Spot, an AI-powered study tool built with Next.js, Supabase, and the Anthropic LLM, and has shipped projects ranging from a voice-controlled self-moving chess set at ACM Riverside to BitWizards, a Blockly-powered educational platform built at Cutie Hack 2025. He works primarily in Python, TypeScript, and React.";
const BROAD_TERMS = ["david", "vayntrub", "david vayntrub"];

function SearchResults() {
  const { query, activeFilter, setQuery } = useSearch();
  const lowerQuery = query.toLowerCase();
  const isBroadSearch = !query.trim() || BROAD_TERMS.includes(lowerQuery);

  const filteredProjects = useMemo(
    () =>
      isBroadSearch
        ? projects
        : searchItems(projects, query, {
            getText: (project) => [
              project.title,
              project.url,
              project.snippet,
              project.details,
              ...project.tags,
            ],
          }),
    [query, isBroadSearch]
  );

  const filteredExperiences = useMemo(() => {
    const exps = isBroadSearch
      ? experiences
      : searchItems(experiences, query, {
          getText: (experience) => [
            experience.title,
            experience.url,
            experience.snippet,
            experience.details,
          ],
        });

    // Only include the first hackathon found while maintaining order
    let hackathonFound = false;
    const result: typeof experiences = [];

    for (const e of exps) {
      const isHackathon =
        e.title.toLowerCase().includes("hack") ||
        e.details.toLowerCase().includes("hackathon");

      if (isHackathon) {
        if (!hackathonFound) {
          result.push(e);
          hackathonFound = true;
        }
      } else {
        result.push(e);
      }
    }

    return result;
  }, [query, isBroadSearch]);

  const showAll = activeFilter === "all";
  const showImages = activeFilter === "images";
  const showBlog = activeFilter === "blog";
  const hasResults =
    filteredProjects.length > 0 || filteredExperiences.length > 0;

  const resultCount = filteredProjects.length + filteredExperiences.length;

  return (
    <div className="min-h-screen flex flex-col">
      <GoogleHeader />

      <main className="flex-1 px-4 md:px-6 lg:px-[180px] py-5">
        <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>
          About {resultCount + 3} results (0.42 seconds)
        </p>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
          <div className="flex-1 min-w-0">
            {/* AI Overview — static pre-written answer for the default landing
                query (instant, no API call); live streamed answer for real
                searches. */}
            {showAll && (
              <AiOverview
                query={query}
                staticAnswer={
                  query === DEFAULT_QUERY ? DEFAULT_OVERVIEW : undefined
                }
              />
            )}

            {!hasResults && (
              <div className="mb-6">
                <p className="text-base" style={{ color: "var(--text)" }}>
                  No results found for <b>&ldquo;{query}&rdquo;</b>
                </p>
                <p
                  className="text-sm mt-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Try searching for{" "}
                  <button
                    onClick={() => setQuery(DEFAULT_QUERY)}
                    className="hover:underline"
                    style={{ color: "var(--google-blue)" }}
                  >
                    &ldquo;david vayntrub&rdquo;
                  </button>{" "}
                  or reach out directly at{" "}
                  <a
                    href="mailto:vayntrub2006@gmail.com"
                    className="hover:underline"
                    style={{ color: "var(--google-blue)" }}
                  >
                    vayntrub2006@gmail.com
                  </a>
                </p>
              </div>
            )}

            {showAll && <SponsoredResult />}

            {filteredExperiences.length > 0 && showAll && (
              <>
                {filteredExperiences.map((exp) => (
                  <OrganicResult
                    key={exp.id}
                    title={exp.title}
                    url={exp.url}
                    href={exp.href}
                    snippet={exp.snippet}
                    details={exp.details}
                  />
                ))}
              </>
            )}

            {showImages && <ImagesRow />}

            {showBlog &&
              blogPosts.map((post) => (
                <OrganicResult
                  key={post.id}
                  title={post.title}
                  url={post.url}
                  href={post.href}
                  snippet={post.snippet}
                  details={post.details}
                  tags={post.tags}
                />
              ))}

            {showAll && <PeopleAlsoAsk />}

            {filteredProjects.length > 0 && showAll && (
              <>
                {filteredProjects.map((project) => (
                  <OrganicResult
                    key={project.id}
                    title={project.title}
                    url={project.url}
                    href={project.href}
                    snippet={project.snippet}
                    details={project.details}
                    tags={project.tags}
                  />
                ))}
              </>
            )}

            <Pagination />
          </div>

          <div className="hidden lg:block">
            {!showImages && <KnowledgePanel />}
          </div>
        </div>
      </main>

      <GeoFooter />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <SearchProvider>
        <SearchResults />
      </SearchProvider>
    </Suspense>
  );
}
