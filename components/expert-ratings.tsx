"use client";

import { User, Star } from "lucide-react";
import type { ExpertRating } from "@/ai/tools";

interface ExpertRatingsProps {
  expertRatings: ExpertRating[];
}

function ScoreBar({
  dimension,
  score,
  maxScore,
  comment,
}: {
  dimension: string;
  score: number;
  maxScore: number;
  comment: string;
}) {
  const percentage = (score / maxScore) * 100;
  const getColorClass = () => {
    if (percentage >= 85) return "bg-emerald-500";
    if (percentage >= 70) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          {dimension}
        </span>
        <span className="tabular-nums text-zinc-500 dark:text-zinc-400">
          {score}/{maxScore}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-700">
        <div
          className={`h-full rounded-full transition-all ${getColorClass()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{comment}</p>
    </div>
  );
}

function ExpertCard({ expert }: { expert: ExpertRating }) {
  const avgScore =
    expert.ratings.reduce((sum, r) => sum + r.score, 0) / expert.ratings.length;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
          <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {expert.expertName}
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {expert.expertTitle}
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 dark:bg-indigo-900/30">
          <Star className="h-3.5 w-3.5 text-indigo-500" />
          <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
            {avgScore.toFixed(0)}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {expert.ratings.map((rating, index) => (
          <ScoreBar key={index} {...rating} />
        ))}
      </div>

      <div className="mt-4 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-700/50">
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          {expert.overallComment}
        </p>
      </div>
    </div>
  );
}

export function ExpertRatings({ expertRatings }: ExpertRatingsProps) {
  return (
    <div className="w-full max-w-sm space-y-3">
      <div className="flex items-center gap-2 px-1">
        <User className="h-4 w-4 text-indigo-500" />
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          专家评分
        </h3>
      </div>
      <div className="space-y-3">
        {expertRatings.map((expert, index) => (
          <ExpertCard key={index} expert={expert} />
        ))}
      </div>
    </div>
  );
}