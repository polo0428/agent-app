"use client";

import { Search, FileText, TrendingUp, Users, Award, BarChart3 } from "lucide-react";

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  prompt: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    id: "search",
    icon: <Search className="h-5 w-5" />,
    label: "查询评价",
    description: "查询教师的教学评价数据",
    prompt: "查询张老师的教学评价",
    color: "bg-blue-500",
  },
  {
    id: "analyze",
    icon: <FileText className="h-5 w-5" />,
    label: "分析报告",
    description: "生成详细的分析报告",
    prompt: "帮我分析李老师的教学数据并生成报告",
    color: "bg-emerald-500",
  },
  {
    id: "trend",
    icon: <TrendingUp className="h-5 w-5" />,
    label: "趋势分析",
    description: "查看教学评分趋势",
    prompt: "展示王老师的评分趋势分析",
    color: "bg-violet-500",
  },
  {
    id: "compare",
    icon: <Users className="h-5 w-5" />,
    label: "对比分析",
    description: "对比多位教师的教学表现",
    prompt: "对比张老师和李老师的教学表现",
    color: "bg-amber-500",
  },
  {
    id: "improve",
    icon: <Award className="h-5 w-5" />,
    label: "改进建议",
    description: "获取教学改进建议",
    prompt: "赵老师的教学有哪些需要改进的地方？",
    color: "bg-rose-500",
  },
  {
    id: "stats",
    icon: <BarChart3 className="h-5 w-5" />,
    label: "数据统计",
    description: "查看整体教学统计数据",
    prompt: "展示本学期的教学评价统计数据",
    color: "bg-cyan-500",
  },
];

interface QuickActionsProps {
  onAction: (prompt: string) => void;
}

export function QuickActions({ onAction }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {quickActions.map((action) => (
        <button
          key={action.id}
          onClick={() => onAction(action.prompt)}
          className="group flex flex-col items-start gap-2 rounded-xl border border-zinc-200 bg-white p-4 text-left transition-all hover:border-zinc-300 hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
        >
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg text-white ${action.color}`}
          >
            {action.icon}
          </div>
          <div>
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {action.label}
            </h3>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              {action.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}