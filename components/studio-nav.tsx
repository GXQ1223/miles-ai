import Link from "next/link";
import { StudioLogoutButton } from "./studio-logout-button";

const links = [
  ["Dashboard", "/studio"],
  ["Vault", "/studio/vault"],
  ["Import", "/studio/import"],
  ["Compose", "/studio/compose"],
  ["Drafts", "/studio/drafts"],
  ["Collections", "/studio/collections"],
  ["Relationships", "/studio/relationships"],
  ["Settings", "/studio/settings"]
];

export function StudioNav() {
  return (
    <aside className="studioNav">
      <strong>Private Studio</strong>
      {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
      <StudioLogoutButton />
    </aside>
  );
}
