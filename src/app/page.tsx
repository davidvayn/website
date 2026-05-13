"use client";

import { useMemo, Suspense } from "react";
import { SearchProvider, useSearch } from "@/hooks/useSearch";
import GoogleHeader from "@/components/GoogleHeader";
import SponsoredResult from "@/components/SponsoredResult";
import OrganicResult from "@/components/OrganicResult";
import PeopleAlsoAsk from "@/components/PeopleAlsoAsk";
import ImagesRow from "@/components/ImagesRow";
import KnowledgePanel from "@/components/KnowledgePanel";
import Pagination from "@/components/Pagination";
import GeoFooter from "@/components/GeoFooter";
import { projects } from "@/data/projects";
import { experiences } from "@/data/experiences";

const DEFAULT_QUERY = "David Vayntrub";
const BROAD_TERMS = ["david", "vayntrub", "david vayntrub"];

function SearchResults() {
  const { query, activeFilter, setQuery } = useSearch();
  const lowerQuery = query.toLowerCase();
  const isBroadSearch =
    !query.trim() || BROAD_TERMS.includes(lowerQuery);

  const filteredProjects = useMemo(
    () =>
      isBroadSearch
        ? projects
        : projects.filter(
            (p) =>
              p.title.toLowerCase().includes(lowerQuery) ||
              p.snippet.toLowerCase().includes(lowerQuery) ||
              p.tags.some((t) => t.toLowerCase().includes(lowerQuery))
          ),
    [lowerQuery, isBroadSearch]
  );

  const filteredExperiences = useMemo(() => {
    const exps = isBroadSearch
      ? experiences
      : experiences.filter(
          (e) =>
            e.title.toLowerCase().includes(lowerQuery) ||
            e.snippet.toLowerCase().includes(lowerQuery)
        );

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
  }, [lowerQuery, isBroadSearch]);

  const showAll = activeFilter === "all";
  const showImages = activeFilter === "images";
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
                    snippet={exp.snippet}
                    details={exp.details}
                  />
                ))}
              </>
            )}

            {showImages && <ImagesRow />}

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

            {showAll && <PeopleAlsoAsk />}

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
