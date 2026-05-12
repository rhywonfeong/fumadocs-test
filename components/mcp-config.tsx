"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { useCredentials } from "@/lib/credentials";

type Variant = "react" | "native";

const V: Record<Variant, { name: string; url: string }> = {
  react: {
    name: "heroui-pro",
    url: "https://hp-mcp-proxy.932324.xyz/mcp",
  },
  native: {
    name: "heroui-native-pro",
    url: "https://hp-native-mcp-proxy.932324.xyz/mcp",
  },
};

function json(v: Variant, token: string, key = "mcpServers") {
  return JSON.stringify(
    {
      [key]: {
        [V[v].name]: {
          type: "http",
          url: V[v].url,
          headers: { "x-heroui-personal-token": token },
        },
      },
    },
    null,
    2,
  );
}

function toml(v: Variant, token: string) {
  return `[mcp_servers.${V[v].name}]
url = "${V[v].url}"
http_headers = { "x-heroui-personal-token" = "${token}" }`;
}

function cli(v: Variant, token: string) {
  return `claude mcp add -s user --transport http ${V[v].name} ${V[v].url} --header "x-heroui-personal-token: ${token}"`;
}

export function McpConfig() {
  const [v, setV] = useState<Variant>("react");
  const { personalToken, ready } = useCredentials();

  if (!ready) return null;

  const token = personalToken ?? "HEROUI_PERSONAL_TOKEN";

  return (
    <>
      <div className="inline-flex rounded-lg border border-fd-border p-1 gap-0.5 mb-4">
        {(["react", "native"] as const).map((key) => (
          <button
            type="button"
            key={key}
            onClick={() => setV(key)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer",
              v === key
                ? "bg-fd-primary text-fd-primary-foreground"
                : "text-fd-muted-foreground hover:text-fd-foreground",
            )}
          >
            {key === "react" ? "React Pro" : "Native Pro"}
          </button>
        ))}
      </div>

      <Tabs
        items={["cursor", "claude code", "vs code", "windsurf", "zed", "codex"]}
      >
        <Tab value="cursor">
          <p>
            添加到 <code>.cursor/mcp.json</code> 或{" "}
            <strong>Settings &gt; Tools &gt; MCP Servers</strong>：
          </p>
          <DynamicCodeBlock
            lang="json"
            code={json(v, token, "mcpServers")}
            codeblock={{ title: ".cursor/mcp.json" }}
          />
          <p>
            在 <strong>Settings &gt; Tools &amp; MCPs</strong> 中启用连接。
          </p>
        </Tab>
        <Tab value="claude code">
          <p>命令行添加：</p>
          <DynamicCodeBlock
            lang="bash"
            code={cli(v, token)}
            codeblock={{ title: "terminal" }}
          />
          <p>
            或添加到 <code>.mcp.json</code>：
          </p>
          <DynamicCodeBlock
            lang="json"
            code={json(v, token, "mcpServers")}
            codeblock={{ title: ".mcp.json" }}
          />
          <p>
            重启后运行 <code>/mcp</code> 确认连接。
          </p>
        </Tab>
        <Tab value="vs code">
          <p>
            添加到 <code>.vscode/mcp.json</code>：
          </p>
          <DynamicCodeBlock
            lang="json"
            code={json(v, token, "servers")}
            codeblock={{ title: ".vscode/mcp.json" }}
          />
          <p>打开文件并点击 Start。</p>
        </Tab>
        <Tab value="windsurf">
          <p>
            添加到 <code>.windsurf/mcp.json</code>：
          </p>
          <DynamicCodeBlock
            lang="json"
            code={json(v, token, "mcpServers")}
            codeblock={{ title: ".windsurf/mcp.json" }}
          />
          <p>重启 Windsurf 生效。</p>
        </Tab>
        <Tab value="zed">
          <p>
            添加到 <code>settings.json</code>（Cmd-,）：
          </p>
          <DynamicCodeBlock
            lang="json"
            code={json(v, token, "context_servers")}
            codeblock={{ title: "settings.json" }}
          />
          <p>重启后检查 Agent Panel 中的绿色连接指示器。</p>
        </Tab>
        <Tab value="codex">
          <p>
            添加到 <code>~/.codex/config.toml</code>（或项目级{" "}
            <code>.codex/config.toml</code>）：
          </p>
          <DynamicCodeBlock
            lang="toml"
            code={toml(v, token)}
            codeblock={{ title: "config.toml" }}
          />
          <p>
            重启 Codex 后运行 <code>/mcp</code> 确认。
          </p>
        </Tab>
      </Tabs>
    </>
  );
}
