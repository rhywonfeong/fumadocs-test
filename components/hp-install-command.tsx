"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { useSearchParams } from "next/navigation";

export function HpInstallCommand() {
  const searchParams = useSearchParams();
  const key = searchParams.get("key") ?? "<your_hp_key>";
  const command = `npx -y hpsetup@latest ${key}`;

  return (
    <DynamicCodeBlock
      lang="bash"
      code={command}
      codeblock={{ title: "terminal" }}
    />
  );
}
