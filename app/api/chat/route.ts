import { streamText, convertToModelMessages, UIMessage } from 'ai';
import { openai } from '@ai-sdk/openai';
import { tools } from '@/ai/tools';

export async function POST(request: Request) {
  const { messages }: { messages: UIMessage[] } = await request.json();

  const result = streamText({
    model: openai('gpt-4-turbo'),
    system: `你是一个专业的股票和期权分析助手。你可以帮助用户分析股票行情、期权数据和市场趋势。
当用户询问某只股票或 ETF 时，请调用 get_stock_analysis 工具来获取实时数据。
回复请使用中文，语言简洁专业。`,
    messages: await convertToModelMessages(messages),
    tools,
  });

  return result.toUIMessageStreamResponse();
}
