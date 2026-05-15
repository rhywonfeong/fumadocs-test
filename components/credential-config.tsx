"use client";

import { useState, useEffect, useRef } from "react";
import { useCredentials } from "@/lib/credentials";
import { cn } from "@/lib/cn";

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
      />
    </svg>
  );
}

function KeyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
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
  );
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
      />
    </svg>
  );
}

export function CredentialConfig() {
  const { hpKey, personalToken, setHpKey, setPersonalToken, ready } =
    useCredentials();
  const [inputHpKey, setInputHpKey] = useState("");
  const [inputToken, setInputToken] = useState("");
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isConfigured = !!(hpKey || personalToken);

  useEffect(() => {
    setInputHpKey(hpKey ?? "");
    setInputToken(personalToken ?? "");
  }, [hpKey, personalToken]);

  useEffect(() => {
    if (isConfigured && !editing) setEditing(false);
  }, [isConfigured, editing]);

  useEffect(() => {
    return () => {
      if (savedTimer.current) clearTimeout(savedTimer.current);
    };
  }, []);

  if (!ready) return null;

  const handleSave = () => {
    if (inputHpKey.trim()) setHpKey(inputHpKey.trim());
    else if (hpKey) setHpKey("");
    if (inputToken.trim()) setPersonalToken(inputToken.trim());
    else if (personalToken) setPersonalToken("");

    setSaved(true);
    setEditing(false);
    if (savedTimer.current) clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSaved(false), 2000);
  };

  const handleEdit = () => {
    setEditing(true);
    setSaved(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setInputHpKey(hpKey ?? "");
    setInputToken(personalToken ?? "");
  };

  // ── 已配置：紧凑的已连接状态 ──
  if (isConfigured && !editing) {
    return (
      <div className="not-prose">
        <div className="group relative max-w-md overflow-hidden rounded-xl border border-fd-border bg-fd-card p-5 space-y-4 shadow-sm transition-all duration-300">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-fd-muted transition-colors duration-300">
              <ShieldIcon className="size-4 text-fd-foreground/60" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-fd-foreground">
                凭据已就绪
              </h3>
              <p className="text-[11px] text-fd-muted-foreground">
                已保存至本机 localStorage
              </p>
            </div>
            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex items-center gap-1.5 rounded-lg border border-fd-border px-2.5 py-1.5 text-xs font-medium text-fd-muted-foreground opacity-0 transition-opacity hover:bg-fd-muted hover:text-fd-foreground group-hover:opacity-100 cursor-pointer"
            >
              <PencilIcon className="size-3" />
              修改
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {hpKey && (
              <span className="inline-flex items-center gap-1 rounded-md border border-fd-border bg-fd-background px-2 py-px text-[11px] leading-4 font-medium text-fd-foreground/70">
                <span className="size-1 rounded-full bg-emerald-500" />
                HP Key
              </span>
            )}
            {personalToken && (
              <span className="inline-flex items-center gap-1 rounded-md border border-fd-border bg-fd-background px-2 py-px text-[11px] leading-4 font-medium text-fd-foreground/70">
                <span className="size-1 rounded-full bg-emerald-500" />
                Personal Token
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── 未配置 / 编辑中：配置表单（保持原版样式） ──
  return (
    <div className="not-prose">
      <div className="rounded-xl border border-fd-border bg-fd-card p-5 space-y-4 max-w-md shadow-sm">
        <div className="flex items-center gap-2">
          <KeyIcon className="size-4 text-fd-muted-foreground" />
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
          <span className="text-[11px] text-fd-muted-foreground">
            仅本机 localStorage
          </span>
          <div className="flex items-center gap-2">
            {editing && (
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-fd-muted-foreground hover:text-fd-foreground transition-colors cursor-pointer"
              >
                取消
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              className={cn(
                "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all cursor-pointer",
                saved
                  ? "bg-emerald-500 text-white"
                  : "bg-fd-primary text-fd-primary-foreground hover:opacity-90 active:scale-[0.97]",
              )}
            >
              {saved ? "已保存" : "保存"}
            </button>
          </div>
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
