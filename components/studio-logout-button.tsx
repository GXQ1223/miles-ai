"use client";

import { useRouter } from "next/navigation";

export function StudioLogoutButton() {
  const router = useRouter();

  async function onLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button type="button" onClick={onLogout}>
      Sign out
    </button>
  );
}
