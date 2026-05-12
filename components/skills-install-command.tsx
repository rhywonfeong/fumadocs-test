"use client";

import { useCredentials } from "@/lib/credentials";

export function SkillsInstallCommand({ skill }: { skill: string }) {
  const { personalToken, ready } = useCredentials();

  if (!ready) return null;

  const token = personalToken ?? "<your_personal_token>";
  const command = `curl -fsSL https://hp-skills.932324.xyz/install | \\\n  HEROUI_PERSONAL_TOKEN=${token} bash -s ${skill}`;

  return (
    <pre className="not-prose rounded-lg border bg-fd-muted/50 p-4 text-sm overflow-x-auto">
      <code>{command}</code>
    </pre>
  );
}
