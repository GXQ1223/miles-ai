import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { NavLinks } from "@/components/nav-links";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Xguo.ai",
  description: "Systems, distance, people, and becoming."
};

const publicLinks: [string, string][] = [
  ["Work", "/work"],
  ["Timeline", "/timeline"],
  ["About", "/about"],
  ["Studio", "/studio"]
];

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <header className="siteHeader">
          <div className="nav-inner">
            <Link href="/" className="brand">xguo.ai</Link>
            <NavLinks links={publicLinks} />
          </div>
        </header>
        <main>{children}</main>
        <footer className="siteFooter">
          xguo.ai — <Link href="/about">Miles Guo</Link> · private archive, published selectively.
        </footer>
      </body>
    </html>
  );
}
