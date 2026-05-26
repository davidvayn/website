import Link from "next/link";

export default function DraftBlogPage() {
  return (
    <main className="min-h-screen px-4 py-8 md:px-6 lg:px-[180px]">
      <div className="max-w-[720px]">
        <Link
          href="/?f=blog"
          className="mb-8 inline-block text-sm hover:underline"
          style={{ color: "var(--google-blue)" }}
        >
          Back to Blog
        </Link>

        <p
          className="mb-2 text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Draft
        </p>
        <h1 className="mb-4 text-3xl font-normal" style={{ color: "var(--text)" }}>
          Draft Blog Post
        </h1>
        <p
          className="mb-8 text-sm leading-6"
          style={{ color: "var(--text-secondary)" }}
        >
          Placeholder page for a future blog post.
        </p>

        <article
          className="space-y-5 text-base leading-7"
          style={{ color: "var(--google-snippet)" }}
        >
          <p>
            Start writing here. Replace this placeholder with the blog intro,
            main argument, examples, and conclusion.
          </p>
          <p>
            This page is wired to the Blog tab result, so the search-style
            listing now has a real destination while the final article is still
            being drafted.
          </p>
        </article>
      </div>
    </main>
  );
}
