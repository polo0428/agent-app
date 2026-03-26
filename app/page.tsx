'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Bot, User, Loader2, AlertCircle, GraduationCap, BarChart3, MessageSquare, Sparkles, Plus, MessageCircle, Settings, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { EvaluationCard } from '@/components/evaluation-card';
import { ExpertRatings } from '@/components/expert-ratings';

// 演示对话数据
const DEMO_CONVERSATIONS = [
  {
    id: '1',
    title: '张老师教学评价',
    preview: '综合评分 92 分，教学水平优秀...',
    time: '今天 14:30',
    isActive: false,
  },
  {
    id: '2',
    title: '李老师课堂分析',
    preview: '课堂表现良好，建议增加听力训练...',
    time: '今天 10:15',
    isActive: false,
  },
  {
    id: '3',
    title: '王老师数据结构课',
    preview: '代码演示规范，学生编程能力提升明显...',
    time: '昨天',
    isActive: false,
  },
  {
    id: '4',
    title: '赵老师思政课改进',
    preview: '课堂互动较少，建议融入案例分析...',
    time: '3天前',
    isActive: false,
  },
];

export default function Page() {
  const [input, setInput] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [conversations, setConversations] = useState(DEMO_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const { messages, sendMessage, status, error, clearError, setMessages } = useChat();
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

  const handleNewChat = () => {
    clearError();
    setActiveConversationId(null);
    setMessages([]); // 清空当前消息，回到欢迎页面
  };

  const handleSelectConversation = (conv: typeof DEMO_CONVERSATIONS[0]) => {
    setActiveConversationId(conv.id);
    // 根据对话标题触发对应的查询
    const queryMap: Record<string, string> = {
      '张老师教学评价': '评价张老师的教学',
      '李老师课堂分析': '李老师课堂表现如何',
      '王老师数据结构课': '王老师的教学评分',
      '赵老师思政课改进': '赵老师需要改进什么',
    };
    const query = queryMap[conv.title] || conv.title;
    clearError();
    sendMessage({ text: query });
  };

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
  };

  return (
    <div className="flex h-dvh bg-zinc-50 dark:bg-zinc-950">
      {/* 左侧栏 */}
      <aside
        className={`flex flex-col border-r border-zinc-200 bg-white transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-900 ${
          sidebarCollapsed ? 'w-0 overflow-hidden' : 'w-64'
        }`}
      >
        {/* Logo 区域 */}
        <div className="flex h-14 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              教学评价
            </span>
          </div>
        </div>

        {/* 新建对话按钮 */}
        <div className="p-3">
          <button
            onClick={handleNewChat}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <Plus className="h-4 w-4" />
            新建对话
          </button>
        </div>

        {/* 对话列表 */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          <div className="mb-2 px-2 text-xs font-medium text-zinc-400 dark:text-zinc-500">
            历史记录
          </div>
          <div className="space-y-1">
            {conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => handleSelectConversation(conv)}
                className={`group flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                  activeConversationId === conv.id
                    ? 'bg-indigo-50 dark:bg-indigo-950/50'
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <MessageCircle className={`mt-0.5 h-4 w-4 shrink-0 ${
                  activeConversationId === conv.id
                    ? 'text-indigo-500'
                    : 'text-zinc-400'
                }`} />
                <div className="min-w-0 flex-1">
                  <div className={`truncate text-sm font-medium ${
                    activeConversationId === conv.id
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-zinc-900 dark:text-zinc-50'
                  }`}>
                    {conv.title}
                  </div>
                  <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {conv.preview}
                  </div>
                  <div className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                    {conv.time}
                  </div>
                </div>
                <button
                  onClick={(e) => handleDeleteConversation(conv.id, e)}
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4 text-zinc-400 hover:text-red-500" />
                </button>
              </button>
            ))}
          </div>
        </div>

        {/* 底部设置 */}
        <div className="border-t border-zinc-200 p-3 dark:border-zinc-800">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
            <Settings className="h-4 w-4" />
            设置
          </button>
        </div>
      </aside>

      {/* 折叠按钮 */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute left-64 top-4 z-10 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
        style={{ left: sidebarCollapsed ? '0.75rem' : '16rem' }}
      >
        {sidebarCollapsed ? (
          <ChevronRight className="h-3 w-3 text-zinc-500" />
        ) : (
          <ChevronLeft className="h-3 w-3 text-zinc-500" />
        )}
      </button>

      {/* 主内容区 */}
      <div className="flex flex-1 flex-col">
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
              <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
                {/* 大图标 */}
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
                  <GraduationCap className="h-10 w-10 text-white" />
                </div>
                
                {/* 欢迎语 */}
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  👋 欢迎使用教学质量评价助手
                </h2>
                <p className="mt-3 max-w-md text-base text-zinc-500 dark:text-zinc-400">
                  基于 AI 的智能教学评估分析工具，帮助您快速了解教师教学质量，生成专业评价报告
                </p>
                
                {/* 功能卡片 */}
                <div className="mt-10 grid w-full max-w-xl grid-cols-2 gap-3">
                  {[
                    {
                      icon: BarChart3,
                      title: '教师评价',
                      desc: '查询教师综合评分',
                      action: '评价张老师的教学',
                    },
                    {
                      icon: MessageSquare,
                      title: '课堂表现',
                      desc: '分析课堂教学效果',
                      action: '李老师课堂表现如何',
                    },
                    {
                      icon: Sparkles,
                      title: '专家点评',
                      desc: '获取专业评价建议',
                      action: '王老师的教学评分',
                    },
                    {
                      icon: GraduationCap,
                      title: '改进建议',
                      desc: '生成提升方案',
                      action: '赵老师需要改进什么',
                    },
                  ].map(item => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => {
                        sendMessage({ text: item.action });
                      }}
                      className="group flex flex-col items-start gap-2 rounded-xl border border-zinc-200 bg-white p-4 text-left transition-all hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/50"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 transition-colors group-hover:bg-indigo-100 dark:bg-zinc-700 dark:group-hover:bg-indigo-900/50">
                        <item.icon className="h-4.5 w-4.5 text-zinc-600 transition-colors group-hover:text-indigo-600 dark:text-zinc-400 dark:group-hover:text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                          {item.title}
                        </h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {item.desc}
                        </p>
                      </div>
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
                          const output = part.output as {
                            name: string;
                            course: string;
                            score: number;
                            rating: 'excellent' | 'good' | 'needs_improvement';
                            evaluation: string;
                            expertRatings?: {
                              expertName: string;
                              expertTitle: string;
                              ratings: {
                                dimension: string;
                                score: number;
                                maxScore: number;
                                comment: string;
                              }[];
                              overallComment: string;
                            }[];
                          };
                          return (
                            <div key={i} className="flex flex-col gap-3">
                              <EvaluationCard {...output} />
                              {output.expertRatings && output.expertRatings.length > 0 && (
                                <ExpertRatings expertRatings={output.expertRatings} />
                              )}
                            </div>
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
    </div>
  );
}