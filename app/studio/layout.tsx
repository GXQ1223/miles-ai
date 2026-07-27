import { StudioNav } from "@/components/studio-nav";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page">
      <div className="notice">
        Owner-only credential authentication is required for this section. MFA, audit
        trails, and the rest of the production controls in docs/PRIVACY.md are not
        implemented yet — do not deploy this publicly without them.
      </div>
      <div className="studioShell section">
        <StudioNav />
        <section>{children}</section>
      </div>
    </div>
  );
}
