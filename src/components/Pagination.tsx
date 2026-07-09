"use client";

const RESULTS_PER_PAGE = 10;

// Doodle colors cycled across the repeated middle letter, one per results page.
const DOODLE_COLORS = ["#fbbc05", "#4285f4", "#34a853", "#ea4335"];

export default function Pagination({
  totalResults,
  perPage = RESULTS_PER_PAGE,
}: {
  totalResults: number;
  perPage?: number;
}) {
  const pageCount = Math.max(1, Math.ceil(totalResults / perPage));
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  // Nothing to paginate on a single page — don't render the footer at all.
  if (pageCount <= 1) {
    return null;
  }

  // Google-style doodle: repeat the middle "a" once per results page, so a
  // single page reads "Dvayn" and the logo stretches as pages are added.
  const logo = [
    { letter: "D", color: "#4285f4" },
    { letter: "v", color: "#ea4335" },
    ...pages.map((_, i) => ({
      letter: "a",
      color: DOODLE_COLORS[i % DOODLE_COLORS.length],
    })),
    { letter: "y", color: "#fbbc05" },
    { letter: "n", color: "#4285f4" },
  ];

  return (
    <div className="flex flex-col items-center py-8">
      <div className="flex items-center text-3xl tracking-widest mb-4">
        {logo.map((l, index) => (
          <span key={index} style={{ color: l.color, fontWeight: 500 }}>
            {l.letter}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span
          className="text-sm px-3 py-2"
          style={{ color: "var(--text-secondary)" }}
        >
          &lt;
        </span>

        {pages.map((page) => (
          <span
            key={page}
            className={`text-sm px-3 py-2 ${
              page === 1 ? "font-bold" : "cursor-pointer hover:underline"
            }`}
            style={{ color: page === 1 ? "#4285f4" : "var(--google-blue)" }}
          >
            {page}
          </span>
        ))}

        <span
          className="text-sm px-3 py-2 cursor-pointer hover:underline"
          style={{ color: "var(--google-blue)" }}
        >
          Next &gt;
        </span>
      </div>
    </div>
  );
}
