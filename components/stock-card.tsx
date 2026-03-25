"use client";

import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

interface StockCardProps {
  symbol: string;
  price: number;
  trend: "up" | "down";
  analysis: string;
}

export function StockCard({ symbol, price, trend, analysis }: StockCardProps) {
  const isUp = trend === "up";

  return (
    <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
            <BarChart3 className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {symbol}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">实时行情</p>
          </div>
        </div>
        <div
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
            isUp
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
              : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"
          }`}
        >
          {isUp ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          {isUp ? "上涨" : "下跌"}
        </div>
      </div>

      <div className="mt-4">
        <span
          className={`text-3xl font-bold tabular-nums ${
            isUp
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          ${price.toFixed(2)}
        </span>
      </div>

      <div className="mt-4 rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/50">
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          {analysis}
        </p>
      </div>
    </div>
  );
}
