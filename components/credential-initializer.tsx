"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function CredentialInitializer({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const hpKey = searchParams.get("hp_key");
  const personalToken = searchParams.get("personal_token");

  useEffect(() => {
    if (hpKey) localStorage.setItem("heroui_hp_key", hpKey);
    if (personalToken) localStorage.setItem("heroui_personal_token", personalToken);

    if (hpKey || personalToken) {
      const url = new URL(window.location.href);
      url.searchParams.delete("hp_key");
      url.searchParams.delete("personal_token");
      window.history.replaceState({}, "", url.toString());
    }
  }, [hpKey, personalToken]);

  return <>{children}</>;
}
