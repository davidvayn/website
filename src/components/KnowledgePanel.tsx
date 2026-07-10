"use client";

import { links } from "@/data/links";

const linkUrl = (id: string) => links.find((l) => l.id === id)?.url ?? "#";

export default function KnowledgePanel() {
  return (
    <aside
      className="rounded-lg border p-5 w-full lg:w-[360px] flex-shrink-0"
      style={{
        backgroundColor: "var(--knowledge-bg)",
        borderColor: "var(--knowledge-border)",
      }}
    >
      <div className="flex flex-col items-center mb-4">
        <div
          className="w-[120px] h-[120px] rounded-full flex items-center justify-center mb-3"
          style={{ backgroundColor: "var(--hover-bg)" }}
        >
          <svg
            className="w-16 h-16"
            style={{ color: "var(--text-secondary)" }}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>

        <h2
          className="text-2xl font-normal mb-1"
          style={{ color: "var(--text)" }}
        >
          David Vayntrub
        </h2>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Full-Stack Developer
        </p>
      </div>

      <div
        className="border-t pt-4 mb-4"
        style={{ borderColor: "var(--border)" }}
      >
        <p
          className="text-sm leading-6"
          style={{ color: "var(--google-snippet)" }}
        >
          Full-Stack Developer based in San Francisco, CA with 3 years of
          experience building modern web applications. Specializes in React,
          Next.js, Node.js, and TypeScript.
        </p>
      </div>

      <div
        className="border-t pt-4 space-y-3"
        style={{ borderColor: "var(--border)" }}
      >
        <InfoRow label="Location" value="San Francisco, CA" />
        <InfoRow label="Experience" value="3 years" />
        <InfoRow label="Education" value="University of California, Riverside" />
        <InfoRow label="Focus" value="Full-Stack Web Development" />
      </div>

      <div
        className="border-t pt-4 mt-4"
        style={{ borderColor: "var(--border)" }}
      >
        <h4
          className="text-sm font-medium mb-3"
          style={{ color: "var(--text)" }}
        >
          Profiles
        </h4>
        <div className="flex gap-3">
          <a
            href={linkUrl("github")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm hover:underline"
            style={{ color: "var(--google-blue)" }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            GitHub
          </a>
          <a
            href={linkUrl("linkedin")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm hover:underline"
            style={{ color: "var(--google-blue)" }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
            LinkedIn
          </a>
        </div>
      </div>
    </aside>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span style={{ color: "var(--text-secondary)" }}>{label}</span>
      <span style={{ color: "var(--text)" }}>{value}</span>
    </div>
  );
}
