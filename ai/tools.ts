import { tool } from 'ai';
import { z } from 'zod';

const MOCK_DATA: Record<
  string,
  { symbol: string; price: number; trend: 'up' | 'down'; analysis: string }
> = {
  NVDA: {
    symbol: 'NVDA',
    price: 892.35,
    trend: 'up',
    analysis:
      'NVDA 受 AI 芯片需求强劲推动持续走高，数据中心收入同比增长 409%。技术面看多头排列，MACD 金叉，短期支撑位 $850，阻力位 $920。期权隐含波动率偏高，建议关注财报前的 IV crush 机会。',
  },
  QQQ: {
    symbol: 'QQQ',
    price: 445.12,
    trend: 'down',
    analysis:
      'QQQ 今日受科技股回调拖累小幅下跌，成分股中半导体板块承压。RSI 指标显示短期超买后回落，60 日均线 $432 形成有效支撑。期权 Put/Call 比率上升至 1.2，市场避险情绪有所升温。',
  },
  AAPL: {
    symbol: 'AAPL',
    price: 178.72,
    trend: 'up',
    analysis:
      'AAPL 在 Vision Pro 发布后市场反应积极，服务收入连续创新高。股价站稳 20 日均线，量能温和放大。期权市场显示机构投资者正在布局看涨价差策略，目标价 $190。',
  },
  TSLA: {
    symbol: 'TSLA',
    price: 175.21,
    trend: 'down',
    analysis:
      'TSLA 近期因价格战毛利率承压，交付量未达市场预期。技术面跌破 $180 关键支撑，下方 $165 为强支撑区。期权 IV 处于较高水平，可考虑卖出跨式策略获取时间价值衰减收益。',
  },
};

async function fetchStockFromBackend(symbol: string) {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const upper = symbol.toUpperCase();
  if (MOCK_DATA[upper]) return MOCK_DATA[upper];

  const randomPrice = 100 + Math.random() * 400;
  const trend = Math.random() > 0.5 ? 'up' : 'down';
  return {
    symbol: upper,
    price: Math.round(randomPrice * 100) / 100,
    trend: trend as 'up' | 'down',
    analysis: `${upper} 当前价格 $${randomPrice.toFixed(2)}，市场交投活跃。技术指标显示短期趋势${trend === 'up' ? '偏多' : '偏空'}，建议结合基本面进一步分析。`,
  };
}

export const getStockAnalysis = tool({
  description:
    'Analyze stock or ETF data for a given symbol. Call this when the user asks about a stock price, stock analysis, or options data for tickers like NVDA, QQQ, AAPL, TSLA, etc.',
  inputSchema: z.object({
    symbol: z
      .string()
      .describe('The stock or ETF ticker symbol, e.g. NVDA, QQQ, AAPL'),
  }),
  execute: async ({ symbol }) => fetchStockFromBackend(symbol),
});

export const tools = {
  get_stock_analysis: getStockAnalysis,
};
