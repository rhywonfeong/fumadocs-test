"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { useCredentials } from "@/lib/credentials";

export function HpInstallCommand() {
  const { hpKey, ready } = useCredentials();

  if (!ready) return null;

  const key = hpKey ?? "<your_hp_key>";
  const command = `npx -y hpsetup@latest ${key}`;

  return (
    <DynamicCodeBlock
      lang="bash"
      code={command}
      codeblock={{ title: "terminal" }}
    />
  );
}
