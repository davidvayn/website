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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
