"use client";

import { useEffect, useState } from "react";
import { startRegistration } from "@simplewebauthn/browser";

type Status = "idle" | "working" | "done" | "error";

export default function SetupPage() {
  const [setupToken, setSetupToken] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [credentialJson, setCredentialJson] = useState<string | null>(null);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) setSetupToken(token);
  }, []);

  async function onRegister() {
    setStatus("working");
    setError(null);

    try {
      const optionsRes = await fetch("/api/auth/register/options", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ setupToken })
      });
      if (!optionsRes.ok) {
        const body = await optionsRes.json().catch(() => null);
        throw new Error(body?.error ?? "Setup is not available.");
      }
      const optionsJSON = await optionsRes.json();

      const attestation = await startRegistration({ optionsJSON });

      const verifyRes = await fetch("/api/auth/register/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ setupToken, response: attestation })
      });
      const verifyBody = await verifyRes.json().catch(() => null);
      if (!verifyRes.ok) {
        throw new Error(verifyBody?.error ?? "Registration failed.");
      }

      setCredentialJson(JSON.stringify(verifyBody.credential));
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
      setStatus("error");
    }
  }

  if (status === "done" && credentialJson) {
    return (
      <div className="page">
        <h1>Passkey registered</h1>
        <p className="lede">
          You&apos;re signed in to Studio now. To make this passkey survive a restart or redeploy,
          copy the value below into <code>AUTH_PASSKEY_CREDENTIAL</code> in your environment, then
          redeploy.
        </p>
        <pre>{credentialJson}</pre>
        <div className="notice">
          Once that value is saved, also remove <code>AUTH_SETUP_TOKEN</code> from your
          environment. It isn&apos;t load-bearing — the server already permanently refuses any
          further registration now that a credential exists — but removing it is good defense in
          depth.
        </div>
        <p className="lede">
          <a href="/studio">Go to Studio →</a>
        </p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Register your passkey</h1>
      <p className="lede">
        One-time setup. Use your phone&apos;s Face ID, Touch ID, or fingerprint — either directly
        if you&apos;re completing this on the phone, or as a roaming authenticator (via QR code)
        if you&apos;re on another device.
      </p>
      <div className="field">
        <label htmlFor="setupToken">Setup token</label>
        <input
          id="setupToken"
          value={setupToken}
          onChange={(event) => setSetupToken(event.target.value)}
          autoComplete="off"
        />
      </div>
      {error && (
        <p role="alert" style={{ color: "#b3261e" }}>
          {error}
        </p>
      )}
      <button type="button" onClick={onRegister} disabled={status === "working" || !setupToken}>
        {status === "working" ? "Waiting for passkey…" : "Register passkey"}
      </button>
    </div>
  );
}
