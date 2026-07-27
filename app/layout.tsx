import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Miles.ai",
  description: "Systems, distance, people, and becoming."
};

const publicLinks = [
  ["Now", "/now"],
  ["Work", "/work"],
  ["Garden", "/garden"],
  ["Miles", "/miles"],
  ["Timeline", "/timeline"],
  ["Archive", "/archive/2026"],
  ["About", "/about"]
];

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="siteHeader">
          <Link href="/" className="brand">miles.ai</Link>
          <nav>
            {publicLinks.map(([label, href]) => (
              <Link key={href} href={href}>{label}</Link>
            ))}
            <Link href="/studio">Studio</Link>
          </nav>
        </header>
        <main>{children}</main>
        <footer>
          <span>Miles Guo</span>
          <span>Private archive → deliberate publication</span>
        </footer>
      </body>
    </html>
  );
}
