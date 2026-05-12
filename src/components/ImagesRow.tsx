"use client";

import { projects } from "@/data/projects";

export default function ImagesRow() {
  return (
    <div className="mb-6 max-w-[600px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-normal" style={{ color: "var(--text)" }}>
          Images
        </h3>
        <button
          className="text-sm hover:underline"
          style={{ color: "var(--google-blue)" }}
        >
          View all
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex-shrink-0 w-[150px] h-[100px] rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: "var(--hover-bg)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="text-center px-2">
              <svg
                className="w-8 h-8 mx-auto mb-1"
                style={{ color: "var(--text-secondary)" }}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
              </svg>
              <span
                className="text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                {project.title.split(" - ")[0]}
              </span>
            </div>
          </div>
        ))}
        <div
          className="flex-shrink-0 w-[150px] h-[100px] rounded-lg flex items-center justify-center"
          style={{
            backgroundColor: "var(--hover-bg)",
            border: "1px solid var(--border)",
          }}
        >
          <span className="text-sm" style={{ color: "var(--google-blue)" }}>
            + More
          </span>
        </div>
      </div>
    </div>
  );
}
