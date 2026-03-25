'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Bot, User, Loader2, AlertCircle } from 'lucide-react';
import { EvaluationCard } from '@/components/evaluation-card';

export default function Page() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, error, clearError } = useChat({
    api: '/api/chat',
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isLoading = status === 'submitted' || status === 'streaming';

  const showThinking = useMemo(() => {
    if (status === 'submitted') return true;
    if (status !== 'streaming') return false;
    const last = messages[messages.length - 1];
    if (!last || last.role !== 'assistant') return true;
    return !last.parts.some(p => {
      if (p.type === 'text' && 'text' in p && p.text) return true;
      if (
        typeof p.type === 'string' &&
        p.type.startsWith('tool-') &&
        'state' in p &&
        p.state === 'output-available'
      ) {
        return true;
      }
      return false;
    });
  }, [status, messages]);

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
    clearError();
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
            教学质量评价助手
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            基于 AI 的教学评估分析 · 支持教师评价 & 课程反馈
          </p>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium">请求失败</p>
                <p className="mt-1 break-words text-red-700 dark:text-red-300">
                  {error.message}
                </p>
                <p className="mt-2 text-xs text-red-600/90 dark:text-red-400/90">
                  请检查 .env.local 中的{' '}
                  <code className="rounded bg-red-100 px-1 dark:bg-red-900">
                    OPENAI_BASE_URL
                  </code>{' '}
                  与{' '}
                  <code className="rounded bg-red-100 px-1 dark:bg-red-900">
                    OPENAI_API_KEY
                  </code>{' '}
                  是否配置正确。
                </p>
              </div>
            </div>
          )}

          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/30">
                <Bot className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                你好，我是教学质量评价助手
              </h2>
              <p className="mt-2 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
                试试问我「评价一下张老师的教学」或「李老师的课堂表现如何」
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {[
                  '评价张老师的教学',
                  '李老师课堂表现如何',
                  '王老师的教学评分',
                  '赵老师需要改进什么',
                ].map(suggestion => (
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
                ))}
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

                    if (part.type === 'tool-get_teaching_evaluation') {
                      if (part.state === 'output-available') {
                        return (
                          <EvaluationCard
                            key={i}
                            {...(part.output as {
                              name: string;
                              course: string;
                              score: number;
                              rating: 'excellent' | 'good' | 'needs_improvement';
                              evaluation: string;
                            })}
                          />
                        );
                      }
                      if (part.state === 'output-error') {
                        return (
                          <div
                            key={i}
                            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
                          >
                            工具执行失败：{part.errorText}
                          </div>
                        );
                      }
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm text-zinc-500 shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700"
                        >
                          <Loader2 className="h-4 w-4 animate-spin" />
                          正在查询评价数据…
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
              </div>
            );
          })}

          {showThinking && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-700">
                <Bot className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm text-zinc-500 shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700">
                <Loader2 className="h-4 w-4 animate-spin" />
                {status === 'submitted' ? '连接模型中…' : '生成回复中…'}
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
            placeholder="输入教师姓名或问题，如「评价张老师的教学」…"
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
