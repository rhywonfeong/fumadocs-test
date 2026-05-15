"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { useCredentials } from "@/lib/credentials";

type Variant = "react" | "native";

const V: Record<Variant, { name: string; label: string; desc: string }> = {
  react: {
    name: "heroui-pro",
    label: "React Pro",
    desc: "图表、高级表单、导航、浮层、数据展示",
  },
  native: {
    name: "heroui-native-pro",
    label: "Native Pro",
    desc: "日期选择器、步进器、进度按钮、数字输入框",
  },
};

function json(v: Variant, token: string) {
  return JSON.stringify(
    {
      mcpServers: {
        [V[v].name]: {
          type: "stdio",
          command: "npx",
          args: ["-y", "hpmcp@latest", v, token],
        },
      },
    },
    null,
    2,
  );
}

function toml(v: Variant, token: string) {
  return `[mcp_servers.${V[v].name}]
type = "stdio"
command = "npx"
args = ["-y", "hpmcp@latest", "${v}", "${token}"]`;
}

function cli(v: Variant, token: string) {
  return `claude mcp add -s user -t stdio ${V[v].name} -- npx -y hpmcp@latest ${v} ${token}`;
}

export function HpmcpPage() {
  const [v, setV] = useState<Variant>("react");
  const { personalToken, ready } = useCredentials();

  if (!ready) return null;

  const token = personalToken ?? "HEROUI_PERSONAL_TOKEN";

  return (
    <div className="space-y-8">
      {/* 页面级 switch */}
      <div className="inline-flex rounded-lg border border-fd-border p-1 gap-0.5 mt-2 -mb-4">
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
            {V[key].label}
          </button>
        ))}
      </div>

      <p className="text-fd-foreground">
        {V[v].label} — {V[v].desc}。
      </p>

      {/* 编辑器配置 */}
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
            code={json(v, token)}
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
            code={json(v, token)}
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
            code={json(v, token)}
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
            code={json(v, token)}
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
            code={json(v, token)}
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

      {/* 可选配置 */}
      <div>
        <h2 className="text-xl font-semibold mb-3">可选配置</h2>
        <table>
          <thead>
            <tr>
              <th>环境变量</th>
              <th>默认值</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>CACHE_TTL</code></td>
              <td><code>1800</code></td>
              <td>缓存有效期（秒）</td>
            </tr>
          </tbody>
        </table>
        <DynamicCodeBlock
          lang="json"
          code={JSON.stringify(
            {
              type: "stdio",
              command: "npx",
              args: ["-y", "hpmcp@latest", v, token],
              env: { CACHE_TTL: "3600" },
            },
            null,
            2,
          )}
          codeblock={{ title: "示例：自定义缓存时间" }}
        />
        <p className="mt-3">
          清除缓存：<code>rm -rf ~/.hpmcp/cache</code>
        </p>
      </div>

      {/* 特性 */}
      <div>
        <h2 className="text-xl font-semibold mb-3">特性</h2>
        <ul>
          <li><strong>零配置</strong> — 上游地址内置，添加配置即可使用</li>
          <li><strong>自动缓存</strong> — 响应缓存到本地，重复请求无需联网</li>
          <li><strong>离线可用</strong> — 上游不可用时自动降级到缓存数据</li>
          <li><strong>零依赖</strong> — 纯 Node.js，安装体积极小</li>
        </ul>
      </div>
    </div>
  );
}
