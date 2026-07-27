"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLinks({ links }: { links: [string, string][] }) {
  const pathname = usePathname();
  return (
    <nav className="navLinks">
      {links.map(([label, href]) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link key={href} href={href} className={active ? "active" : undefined}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
