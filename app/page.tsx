'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { StockCard } from '@/components/stock-card';

export default function Page() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isLoading = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    sendMessage({ text: trimmed });
    setInput('');
  };

  return (
    <div className="flex h-dvh flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            股票分析助手
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            基于 AI 的实时行情分析 · 支持股票 & 期权
          </p>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/30">
                <Bot className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                你好，我是你的股票分析助手
              </h2>
              <p className="mt-2 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
                试试问我「分析一下 NVDA」或「QQQ 期权怎么样」
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {['分析 NVDA', '查看 QQQ 行情', 'AAPL 走势如何', 'TSLA 期权分析'].map(
                  suggestion => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => {
                        sendMessage({ text: suggestion });
                      }}
                      className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-indigo-600 dark:hover:bg-indigo-950 dark:hover:text-indigo-300"
                    >
                      {suggestion}
                    </button>
                  ),
                )}
              </div>
            </div>
          )}

          {messages.map(message => {
            const isUser = message.role === 'user';

            return (
              <div
                key={message.id}
                className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    isUser
                      ? 'bg-indigo-600'
                      : 'bg-zinc-200 dark:bg-zinc-700'
                  }`}
                >
                  {isUser ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
                  )}
                </div>
                <div
                  className={`flex max-w-[85%] flex-col gap-3 ${
                    isUser ? 'items-end' : 'items-start'
                  }`}
                >
                  {message.parts.map((part, i) => {
                    if (part.type === 'text' && part.text) {
                      return (
                        <div
                          key={i}
                          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                            isUser
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white text-zinc-800 shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-700'
                          }`}
                        >
                          {part.text}
                        </div>
                      );
                    }

                    if (part.type === 'tool-get_stock_analysis') {
                      if (part.state === 'output-available') {
                        return (
                          <StockCard
                            key={i}
                            {...(part.output as {
                              symbol: string;
                              price: number;
                              trend: 'up' | 'down';
                              analysis: string;
                            })}
                          />
                        );
                      }
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm text-zinc-500 shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700"
                        >
                          <Loader2 className="h-4 w-4 animate-spin" />
                          正在获取行情数据…
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
              </div>
            );
          })}

          {status === 'submitted' && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-700">
                <Bot className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm text-zinc-500 shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700">
                <Loader2 className="h-4 w-4 animate-spin" />
                思考中…
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-2xl items-center gap-3"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="输入股票代码或问题，如「分析 NVDA」…"
            className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/40"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
