"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Code,
  Terminal,
  Link2,
  Smile,
  Hash,
  AtSign,
  Undo2,
  Redo2,
  Sparkles,
  ChevronDown,
  Check,
  X,
  Edit3,
} from "lucide-react";
import {
  apiAdaptSocialCopyWithAi,
  type BroadcastAccountItem,
  type BroadcastPlatformKey,
} from "@/lib/api";

const QUICK_EMOJIS = ["🚀", "⚡", "🛠️", "🔒", "📦", "✨", "✅", "📣"];

interface BroadcastEditorProps {
  baseContent: string;
  platformContent: Record<string, string>;
  activeScope: "MASTER" | BroadcastPlatformKey;
  selectedAccounts: BroadcastAccountItem[];
  allowedVariables: string[];
  aiStatus: { configured: boolean; provider: string; model: string };
  onChangeScope: (scope: "MASTER" | BroadcastPlatformKey) => void;
  onChangeBase: (text: string) => void;
  onChangeOverride: (platform: BroadcastPlatformKey, text: string) => void;
  onClearOverride: (platform: BroadcastPlatformKey) => void;
}

export default function BroadcastEditor({
  baseContent,
  platformContent,
  activeScope,
  selectedAccounts,
  allowedVariables,
  aiStatus,
  onChangeScope,
  onChangeBase,
  onChangeOverride,
  onClearOverride,
}: BroadcastEditorProps) {
  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiPreview, setAiPreview] = useState<{
    suggestion: string;
    targetPlatform: BroadcastPlatformKey;
    charCount: number;
    maxChars: number;
  } | null>(null);

  const currentText =
    activeScope === "MASTER"
      ? baseContent
      : platformContent[activeScope] ?? baseContent;

  const editor = useEditor({
    extensions: [StarterKit],
    content: currentText
      ? currentText
          .split("\n")
          .map((line) => `<p>${line.replace(/</g, "&lt;").replace(/>/g, "&gt;") || "<br>"}</p>`)
          .join("")
      : "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[180px] p-4 text-sm text-[var(--text-primary)] focus:outline-none prose prose-sm max-w-none dark:prose-invert",
      },
    },
    onUpdate: ({ editor: ed }) => {
      const plain = ed.getText({ blockSeparator: "\n" });
      if (activeScope === "MASTER") {
        onChangeBase(plain);
      } else {
        onChangeOverride(activeScope, plain);
      }
    },
  });

  // Sync editor when switching between Master and Platform Override tabs
  useEffect(() => {
    if (!editor) return;
    const editorText = editor.getText({ blockSeparator: "\n" });
    if (editorText !== currentText) {
      const html = currentText
        ? currentText
            .split("\n")
            .map((line) => `<p>${line.replace(/</g, "&lt;").replace(/>/g, "&gt;") || "<br>"}</p>`)
            .join("")
        : "<p></p>";
      editor.commands.setContent(html, { emitUpdate: false });
    }
  }, [activeScope, currentText, editor]);

  const insertToken = (token: string) => {
    if (!editor) return;
    editor.chain().focus().insertContent(token).run();
  };

  const runAiAdapt = async (
    action:
      | "shorten_x"
      | "technical_linkedin"
      | "format_reddit"
      | "generate_hashtags"
      | "improve_clarity"
      | "rewrite_platform",
    targetPlatform: BroadcastPlatformKey,
  ) => {
    setAiMenuOpen(false);
    setAiError(null);
    setAiLoading(true);
    try {
      const res = await apiAdaptSocialCopyWithAi({
        content: currentText,
        action,
        targetPlatform,
      });
      setAiPreview(res);
    } catch (err: any) {
      setAiError(err?.message || "AI adaptation failed.");
    } finally {
      setAiLoading(false);
    }
  };

  const acceptAiPreview = () => {
    if (!aiPreview) return;
    if (activeScope === "MASTER" && aiPreview.targetPlatform !== "TWITTER_X") {
      onChangeBase(aiPreview.suggestion);
    } else if (activeScope !== "MASTER") {
      onChangeOverride(activeScope, aiPreview.suggestion);
    } else {
      onChangeOverride(aiPreview.targetPlatform, aiPreview.suggestion);
      onChangeScope(aiPreview.targetPlatform);
    }
    setAiPreview(null);
  };

  const defaultAiPlatform: BroadcastPlatformKey =
    activeScope !== "MASTER"
      ? activeScope
      : selectedAccounts[0]?.platform || "LINKEDIN";

  return (
    <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4">
      {/* Header + AI Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-[var(--brand-primary)]" />
          <h2 className="font-semibold text-sm text-[var(--text-primary)]">
            Master Dispatch Payload
          </h2>
        </div>

        <div className="relative">
          <button
            type="button"
            disabled={!aiStatus.configured || aiLoading || !currentText.trim()}
            onClick={() => setAiMenuOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-strong)] disabled:opacity-40"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
            <span>
              {!aiStatus.configured
                ? "AI Unavailable (No Key)"
                : aiLoading
                  ? "Adapting..."
                  : "Adapt copy with AI"}
            </span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {aiMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-64 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xl p-1.5 z-30 space-y-0.5 text-xs">
              <button
                type="button"
                onClick={() => void runAiAdapt("shorten_x", "TWITTER_X")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-primary)]"
              >
                Shorten for X (≤ 280 chars)
              </button>
              <button
                type="button"
                onClick={() => void runAiAdapt("technical_linkedin", "LINKEDIN")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-primary)]"
              >
                Add technical depth for LinkedIn
              </button>
              <button
                type="button"
                onClick={() => void runAiAdapt("format_reddit", "REDDIT")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-primary)]"
              >
                Format for Reddit (Markdown)
              </button>
              <button
                type="button"
                onClick={() => void runAiAdapt("generate_hashtags", defaultAiPlatform)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-primary)]"
              >
                Generate relevant hashtags
              </button>
              <button
                type="button"
                onClick={() => void runAiAdapt("improve_clarity", defaultAiPlatform)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-primary)]"
              >
                Improve clarity & readability
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Master vs Platform-Specific Override Tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          type="button"
          onClick={() => onChangeScope("MASTER")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeScope === "MASTER"
              ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)]"
              : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          Master Content
        </button>
        {selectedAccounts.map((acc) => {
          const hasOverride =
            typeof platformContent[acc.platform] === "string" &&
            platformContent[acc.platform]!.trim().length > 0;
          return (
            <button
              key={acc.platform}
              type="button"
              onClick={() => onChangeScope(acc.platform)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all inline-flex items-center gap-1.5 ${
                activeScope === acc.platform
                  ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)]"
                  : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <span>{acc.displayName}</span>
              {hasOverride && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Custom override active" />
              )}
            </button>
          );
        })}
        {activeScope !== "MASTER" && platformContent[activeScope] !== undefined && (
          <button
            type="button"
            onClick={() => onClearOverride(activeScope)}
            className="ml-auto text-[11px] text-[var(--text-secondary)] hover:text-rose-500 underline"
          >
            Reset to Master
          </button>
        )}
      </div>

      {/* TipTap Editor Surface */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 px-2.5 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className="p-1.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className="p-1.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleCode().run()}
            className="p-1.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
            title="Inline Code"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            className="p-1.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
            title="Code Block"
          >
            <Terminal className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-[var(--border-subtle)] mx-1" />
          <button
            type="button"
            onClick={() => insertToken(" https://")}
            className="p-1.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
            title="Insert URL"
          >
            <Link2 className="w-4 h-4" />
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setEmojiOpen((v) => !v)}
              className="p-1.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
              title="Insert Emoji"
            >
              <Smile className="w-4 h-4" />
            </button>
            {emojiOpen && (
              <div className="absolute left-0 mt-1 p-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl flex gap-1 z-20">
                {QUICK_EMOJIS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => {
                      insertToken(em);
                      setEmojiOpen(false);
                    }}
                    className="p-1 rounded hover:bg-[var(--bg-elevated)] text-sm"
                  >
                    {em}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => insertToken(" #")}
            className="p-1.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
            title="Insert Hashtag"
          >
            <Hash className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertToken(" @")}
            className="p-1.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
            title="Insert Mention"
          >
            <AtSign className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-[var(--border-subtle)] mx-1" />
          <button
            type="button"
            onClick={() => editor?.chain().focus().undo().run()}
            className="p-1.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().redo().run()}
            className="p-1.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="ml-auto flex items-center gap-1 flex-wrap">
            {allowedVariables.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => insertToken(`{{${v}}}`)}
                className="px-2 py-0.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                {`{{${v}}}`}
              </button>
            ))}
          </div>
        </div>

        <EditorContent editor={editor} />
      </div>

      {/* AI Error */}
      {aiError && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-600 dark:text-rose-400">
          {aiError}
        </div>
      )}

      {/* AI Suggestion Preview (Requires explicit Accept/Reject) */}
      {aiPreview && (
        <div className="rounded-xl border border-[var(--brand-primary)]/40 bg-[var(--brand-primary)]/5 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[var(--brand-primary)] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              AI Suggestion for {aiPreview.targetPlatform} ({aiPreview.charCount}/{aiPreview.maxChars} chars)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={acceptAiPreview}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-contrast)] text-[11px] font-semibold"
              >
                <Check className="w-3 h-3" /> Accept
              </button>
              <button
                type="button"
                onClick={() => setAiPreview(null)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] text-[11px]"
              >
                <X className="w-3 h-3" /> Discard
              </button>
            </div>
          </div>
          <textarea
            value={aiPreview.suggestion}
            onChange={(e) => setAiPreview({ ...aiPreview, suggestion: e.target.value })}
            rows={4}
            className="w-full p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none"
          />
        </div>
      )}
    </section>
  );
}
