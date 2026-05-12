"use client";

import { useSyncExternalStore, useCallback } from "react";

const HP_KEY = "heroui_hp_key";
const PERSONAL_TOKEN = "heroui_personal_token";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(key: string) {
  return localStorage.getItem(key);
}

function getServerSnapshot() {
  return null;
}

export function useCredentials() {
  const hpKey = useSyncExternalStore(subscribe, () => getSnapshot(HP_KEY), getServerSnapshot);
  const personalToken = useSyncExternalStore(subscribe, () => getSnapshot(PERSONAL_TOKEN), getServerSnapshot);

  const setHpKey = useCallback((value: string) => {
    localStorage.setItem(HP_KEY, value);
    window.dispatchEvent(new StorageEvent("storage", { key: HP_KEY }));
  }, []);

  const setPersonalToken = useCallback((value: string) => {
    localStorage.setItem(PERSONAL_TOKEN, value);
    window.dispatchEvent(new StorageEvent("storage", { key: PERSONAL_TOKEN }));
  }, []);

  return { hpKey, personalToken, setHpKey, setPersonalToken, ready: true };
}
