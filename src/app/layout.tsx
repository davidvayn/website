import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "David Vayntrub - Full-Stack Developer",
  description:
    "David Vayntrub is a Full-Stack Developer based in San Francisco, CA with 3 years of experience building modern web applications.",
  icons: {
    icon: "/favicon.svg",
  },
};

// Runs synchronously in <head> before the body paints, so the correct theme's
// CSS variables are in place on first paint. Without this the server HTML has no
// data-theme, the page paints with the light `:root` defaults, and then
// useDarkMode flips it to dark on hydration — which the global background-color
// transition animates as a visible white→dark flash.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',t==='dark'?'dark':'light');}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the inline script sets data-theme on <html>
    // before React hydrates, so the attribute differs from the server markup.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
