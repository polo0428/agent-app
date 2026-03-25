"use client";

import { Award, TrendingUp, TrendingDown, BookOpen } from "lucide-react";

interface EvaluationCardProps {
  name: string;
  course: string;
  score: number;
  rating: "excellent" | "good" | "needs_improvement";
  evaluation: string;
}

const RATING_MAP = {
  excellent: { label: "优秀", color: "emerald" },
  good: { label: "良好", color: "amber" },
  needs_improvement: { label: "待提升", color: "red" },
} as const;

export function EvaluationCard({
  name,
  course,
  score,
  rating,
  evaluation,
}: EvaluationCardProps) {
  const { label, color } = RATING_MAP[rating];
  const isPositive = rating !== "needs_improvement";

  const colorClasses = {
    badge: isPositive
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
      : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
    score: isPositive
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-red-600 dark:text-red-400",
  };

  return (
    <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
            <BookOpen className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {name}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{course}</p>
          </div>
        </div>
        <div
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${colorClasses.badge}`}
        >
          {isPositive ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          {label}
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-1">
        <span className={`text-3xl font-bold tabular-nums ${colorClasses.score}`}>
          {score.toFixed(1)}
        </span>
        <span className="text-sm text-zinc-400">/ 100</span>
      </div>

      <div className="mt-4 rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/50">
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          {evaluation}
        </p>
      </div>
    </div>
  );
}
