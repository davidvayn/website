"use client";

import Image from "next/image";
import { projects } from "@/data/projects";

function projectHref(project: (typeof projects)[number]) {
  return project.href ?? `https://${project.url.split(" › ").join("/")}`;
}

function projectCaption(project: (typeof projects)[number]) {
  if (project.id === "project-1") {
    return "Model comparison code and accuracy scoring from the machine learning analysis";
  }

  if (project.id === "project-2") {
    return "BitWizards Blockly-powered CS learning platform from Cutie Hack";
  }

  if (project.id === "project-3") {
    return "Google-styled portfolio with AI Overview search, built in Next.js";
  }

  return `${project.title} preview`;
}

export default function ImagesRow() {
  return (
    <div className="mb-8 max-w-[1100px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-normal" style={{ color: "var(--text)" }}>
          Images
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="min-w-0">
            <a
              href={projectHref(project)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex aspect-[4/3] min-h-[220px] items-center justify-center overflow-hidden rounded-lg"
              style={{
                backgroundColor: "var(--hover-bg)",
                border: "1px solid var(--border)",
              }}
            >
              {project.image !== "" &&
              !project.image.startsWith("/placeholder") ? (
                <Image
                  src={project.image}
                  alt={`${project.title} preview`}
                  width={360}
                  height={270}
                  priority
                  className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                />
              ) : (
                <div className="text-center px-5">
                  <svg
                    className="w-12 h-12 mx-auto mb-3"
                    style={{ color: "var(--text-secondary)" }}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                  </svg>
                  <span
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {project.title.split(" - ")[0]}
                  </span>
                </div>
              )}
            </a>

            <a
              href={projectHref(project)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-sm font-medium leading-5 hover:underline"
              style={{ color: "var(--google-blue)" }}
            >
              {project.title}
            </a>
            <p
              className="mt-1 text-xs leading-5"
              style={{ color: "var(--text-secondary)" }}
            >
              {projectCaption(project)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
