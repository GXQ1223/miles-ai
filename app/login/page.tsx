"use client";

import { useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { startAuthentication } from "@simplewebauthn/browser";

function sanitizeRedirectTarget(target: string | null): string {
  if (!target) return "/studio";
  let resolved: URL;
  try {
    resolved = new URL(target, window.location.origin);
  } catch {
    return "/studio";
  }
  if (resolved.origin !== window.location.origin) {
    return "/studio";
  }
  return `${resolved.pathname}${resolved.search}${resolved.hash}`;
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSignIn(event: MouseEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const optionsRes = await fetch("/api/auth/login/options", { method: "POST" });
      if (!optionsRes.ok) {
        const body = await optionsRes.json().catch(() => null);
        throw new Error(body?.error ?? "No passkey is registered for this site yet.");
      }
      const optionsJSON = await optionsRes.json();

      const assertion = await startAuthentication({ optionsJSON });

      const verifyRes = await fetch("/api/auth/login/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ response: assertion })
      });
      if (!verifyRes.ok) {
        throw new Error("Passkey sign-in failed.");
      }

      const from = sanitizeRedirectTarget(new URLSearchParams(window.location.search).get("from"));
      router.push(from);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Passkey sign-in failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <h1>Studio sign in</h1>
      <p className="lede">Private archive. Owner access only — sign in with your passkey.</p>
      {error && (
        <p role="alert" style={{ color: "#b3261e" }}>
          {error}
        </p>
      )}
      <button type="button" onClick={onSignIn} disabled={submitting} style={{ marginTop: 24 }}>
        {submitting ? "Waiting for passkey…" : "Sign in with passkey"}
      </button>
    </div>
  );
}
