"use client";

import { useState, useEffect } from "react";
import { useCredentials } from "@/lib/credentials";
import { cn } from "@/lib/cn";

export function HomePage() {
  const { hpKey, personalToken, setHpKey, setPersonalToken, ready } =
    useCredentials();
  const [inputHpKey, setInputHpKey] = useState("");
  const [inputToken, setInputToken] = useState("");

  useEffect(() => {
    setInputHpKey(hpKey ?? "");
    setInputToken(personalToken ?? "");
  }, [hpKey, personalToken]);

  if (!ready) return null;

  const handleSave = () => {
    if (inputHpKey.trim()) setHpKey(inputHpKey.trim());
    else if (hpKey) setHpKey("");
    if (inputToken.trim()) setPersonalToken(inputToken.trim());
    else if (personalToken) setPersonalToken("");
  };

  return (
    <div className="space-y-6 not-prose">
      <p className="text-sm text-fd-muted-foreground">
        HeroUI Native 项目初始化、heroui-native-pro 组件安装以及用户相关文档。
        文档正在逐步完善，欢迎{" "}
        <a
          href="https://github.com/rhywonfeong/fumadocs-test/issues"
          className="text-fd-primary hover:underline"
        >
          反馈
        </a>
        。
      </p>

      <div className="rounded-xl border border-fd-border bg-fd-card p-5 space-y-4 max-w-md shadow-sm">
        <div className="flex items-center gap-2">
          <svg
            className="size-4 text-fd-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
            />
          </svg>
          <h3 className="text-sm font-semibold text-fd-foreground">
            凭据配置
          </h3>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-fd-muted-foreground">
                HP Key
              </label>
              <span className="text-[11px] text-fd-muted-foreground">
                hpsetup
              </span>
            </div>
            <input
              type="password"
              value={inputHpKey}
              onChange={(e) => setInputHpKey(e.target.value)}
              placeholder="hp_xxxxxxxxxxxxx"
              spellCheck={false}
              className={cn(
                "w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none transition-all",
                "border-fd-border text-fd-foreground placeholder:text-fd-muted-foreground",
                "focus:border-fd-primary focus:ring-2 focus:ring-fd-primary/20",
              )}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-fd-muted-foreground">
                Personal Token
              </label>
              <span className="text-[11px] text-fd-muted-foreground">
                MCP / Skills
              </span>
            </div>
            <input
              type="password"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              placeholder="your_personal_token"
              spellCheck={false}
              className={cn(
                "w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none transition-all",
                "border-fd-border text-fd-foreground placeholder:text-fd-muted-foreground",
                "focus:border-fd-primary focus:ring-2 focus:ring-fd-primary/20",
              )}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center justify-center rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
          >
            保存
          </button>
          <span className="text-[11px] text-fd-muted-foreground">
            仅本机 localStorage
          </span>
        </div>

        <p className="text-[11px] text-fd-muted-foreground pt-1 border-t border-fd-border">
          链接快速设置：{" "}
          <code className="rounded bg-fd-muted px-1.5 py-0.5 font-mono">
            ?hp_key=xxx&personal_token=xxx
          </code>
        </p>
      </div>
    </div>
  );
}
