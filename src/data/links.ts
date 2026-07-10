export interface SiteLink {
  id: string;
  label: string;
  url: string;
  /** Optional subtitle shown in the hover preview. */
  description?: string;
}

/**
 * Profile, contact, and any other standalone links the AI Overview may surface.
 * This is the single source of truth for these links — add to it freely. Each
 * entry's `id` is what the model references in the corpus (see
 * `src/lib/corpus.ts`); the client resolves ids back to URLs via
 * `src/lib/links.ts`, so an unknown/invented id can never produce a live link.
 *
 * NOTE: only add URLs you control and trust here — every entry is directly
 * linkable from the AI Overview.
 */
export const links: SiteLink[] = [
  {
    id: "github",
    label: "GitHub",
    url: "https://github.com/davidvayn",
    description: "Code & open-source projects",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/david-vayntrub-6b5b1b332",
    description: "Professional profile",
  },
  {
    id: "email",
    label: "Email",
    url: "mailto:vayntrub2006@gmail.com",
    description: "vayntrub2006@gmail.com",
  },
  {
    id: "resume",
    label: "Resume",
    url: "/resume.pdf",
    description: "PDF résumé",
  },
];
