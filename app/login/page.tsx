"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

function sanitizeRedirectTarget(target: string | null): string {
  if (!target) return "/studio";
  if (!target.startsWith("/") || target.startsWith("//") || target.startsWith("/\\")) {
    return "/studio";
  }
  return target;
}

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    setSubmitting(false);
    if (!res.ok) {
      setError("Invalid username or password.");
      return;
    }

    const from = sanitizeRedirectTarget(new URLSearchParams(window.location.search).get("from"));
    router.push(from);
    router.refresh();
  }

  return (
    <div className="page">
      <h1>Studio sign in</h1>
      <p className="lede">Private archive. Owner access only.</p>
      <form onSubmit={onSubmit} style={{ maxWidth: 360 }}>
        <div className="field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            autoComplete="username"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {error && (
          <p role="alert" style={{ color: "#b3261e" }}>
            {error}
          </p>
        )}
        <button type="submit" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
