"use client";

import { MessageSquare, Sparkles, Settings, Plus, Bot } from "lucide-react";

interface SidebarProps {
  onNewChat: () => void;
  chatCount?: number;
}

export function Sidebar({ onNewChat, chatCount = 0 }: SidebarProps) {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-zinc-200 px-4 py-4 dark:border-zinc-800">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            教学评价助手
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Teaching Eval</p>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="flex w-full items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          新对话
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-2">
        <button className="flex w-full items-center gap-3 rounded-lg bg-zinc-100 px-3 py-2.5 text-sm font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50">
          <MessageSquare className="h-4 w-4" />
          对话
          {chatCount > 0 && (
            <span className="ml-auto rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
              {chatCount}
            </span>
          )}
        </button>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
          <Sparkles className="h-4 w-4" />
          智能体
        </button>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
          <Settings className="h-4 w-4" />
          设置
        </button>
      </nav>

      {/* Footer */}
      <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          Powered by AI · 教学质量评价系统
        </p>
      </div>
    </aside>
  );
}