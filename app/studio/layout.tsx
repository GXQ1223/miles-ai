import { StudioNav } from "@/components/studio-nav";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page">
      <div className="notice">
        Development skeleton: authentication is not implemented. Keep Studio private.
      </div>
      <div className="studioShell section">
        <StudioNav />
        <section>{children}</section>
      </div>
    </div>
  );
}
