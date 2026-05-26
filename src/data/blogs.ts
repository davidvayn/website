export interface BlogPost {
  id: string;
  title: string;
  url: string;
  href: string;
  snippet: string;
  tags: string[];
  details: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "blog-1",
    title: "Draft Blog Post",
    url: "dvayn.com › blog › draft",
    href: "/blog/draft",
    snippet:
      "Placeholder blog post. Replace this with a short preview once the post is ready.",
    tags: ["Draft", "Blog"],
    details:
      "Use this placeholder for a future blog post. Update the title, snippet, tags, and details in src/data/blogs.ts when you are ready to publish the real content.",
  },
];
