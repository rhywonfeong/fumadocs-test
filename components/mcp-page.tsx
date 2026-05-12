"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { useCredentials } from "@/lib/credentials";

type Variant = "react" | "native";

const V: Record<Variant, { name: string; url: string; label: string; desc: string }> = {
  react: {
    name: "heroui-pro",
    url: "https://hp-mcp-proxy.932324.xyz/mcp",
    label: "React Pro",
    desc: "图表、高级表单、导航、浮层、数据展示",
  },
  native: {
    name: "heroui-native-pro",
    url: "https://hp-native-mcp-proxy.932324.xyz/mcp",
    label: "Native Pro",
    desc: "日期选择器、步进器、进度按钮、数字输入框",
  },
};

const TOOLS: Record<Variant, { name: string; desc: string }[]> = {
  react: [
    { name: "list_components", desc: "按分类列出所有组件" },
    { name: "get_component_docs", desc: "获取完整文档：结构、复合 API、Props、示例" },
    { name: "get_css", desc: "CSS 系统：设计令牌、组件 BEM 样式、主题变量" },
    { name: "get_docs", desc: "指南：安装、主题、样式、组合、动画" },
  ],
  native: [
    { name: "list_components", desc: "按分类列出所有组件" },
    { name: "get_component_docs", desc: "获取完整文档：结构、复合 API、Props、示例" },
    { name: "get_docs", desc: "指南：安装、主题、样式、组合、动画" },
  ],
};

const EXAMPLES: Record<Variant, string[]> = {
  react: [
    "用 Sidebar、CellSwitch 开关、CellSelect 下拉和 CellSlider 构建一个设置页",
    "创建一个仪表盘，包含 KPI 卡片、TrendChip 和 AreaChart 展示周收入",
    "查看 Sheet 组件的 BEM class，我想自定义 overlay 和 content 的样式",
  ],
  native: [
    "用 Stepper 组件构建一个三步注册流程",
    "创建一个带 DatePicker 和 NumberField 的表单",
    "ProgressButton 和 SlideButton 有什么区别？各给一个示例",
  ],
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

export function McpPage() {
  const [v, setV] = useState<Variant>("react");
  const { personalToken, ready } = useCredentials();

  if (!ready) return null;

  const token = personalToken ?? "HEROUI_PERSONAL_TOKEN";

  return (
    <div className="space-y-8">
      {/* 页面级 switch */}
      <div className="inline-flex rounded-lg border border-fd-border p-1 gap-0.5">
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

      {/* 可用工具 */}
      <div>
        <h2 className="text-xl font-semibold mb-3">可用工具</h2>
        <table>
          <thead>
            <tr>
              <th>工具</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            {TOOLS[v].map((tool) => (
              <tr key={tool.name}>
                <td><code>{tool.name}</code></td>
                <td>{tool.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {v === "react" && (
          <>
            <p className="mt-4">
              <code>get_css</code> 支持三种模式：
            </p>
            <ul>
              <li><code>get_css()</code> — 基础设计令牌 + 可用样式和主题列表</li>
              <li><code>get_css(&#123; components: [&quot;sheet&quot;, &quot;sidebar&quot;] &#125;)</code> — 指定组件的 BEM CSS</li>
              <li><code>get_css(&#123; theme: &quot;brutalism&quot; &#125;)</code> — 完整主题变量（含字体和覆盖）</li>
            </ul>
          </>
        )}
      </div>

      {/* 示例提示词 */}
      <div>
        <h2 className="text-xl font-semibold mb-3">示例提示词</h2>
        <div className="flex flex-col gap-6">
          {EXAMPLES[v].map((ex, i) => (
            <DynamicCodeBlock
              key={i}
              lang="text"
              code={ex}
            />
          ))}
        </div>
      </div>

      {/* 故障排除 */}
      <div>
        <h2 className="text-xl font-semibold mb-3">故障排除</h2>
        <Accordions type="single">
          <Accordion title="无法连接" id="not-connecting">
            Pro MCP 使用 HTTP 传输，无需 Node.js。确认 MCP URL 可达，并在编辑器设置中启用了连接。
          </Accordion>
          <Accordion title="认证错误" id="auth-error">
            检查配置中 <code>headers</code> 字段的 <code>x-heroui-personal-token</code>。CI/CD Token（<code>HEROUI_AUTH_TOKEN</code>）仅用于自动化，编辑器 MCP 应使用 Personal Token。
          </Accordion>
          <Accordion title="工具未被调用" id="tools-not-called">
            在提示词中明确指定："使用 HeroUI Pro MCP 查看 Sheet 组件 API" 或 "查一下 Command 组件结构"。
          </Accordion>
        </Accordions>
      </div>
    </div>
  );
}
