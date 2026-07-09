"use client";

export default function GeoFooter() {
  return (
    <footer
      className="border-t mt-8"
      style={{
        backgroundColor: "var(--footer-bg)",
        borderColor: "var(--footer-border)",
      }}
    >
      <div className="px-4 md:px-6 lg:px-[180px] py-3">
        <p className="text-sm" style={{ color: "var(--text)" }}>
          San Francisco, California - based on your location
        </p>
      </div>

      <div className="px-4 md:px-6 lg:px-[180px] pb-3 flex flex-wrap gap-x-6 gap-y-1">
        <FooterLink href="mailto:vayntrub2006@gmail.com" label="Contact" />
        <FooterLink href="https://github.com/davidvayn" label="GitHub" />
        <FooterLink
          href="https://www.linkedin.com/in/david-vayntrub-6b5b1b332"
          label="LinkedIn"
        />
        <FooterLink href="/resume.pdf" label="Resume" />
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="text-sm hover:underline"
      style={{ color: "var(--text)" }}
    >
      {label}
    </a>
  );
}
