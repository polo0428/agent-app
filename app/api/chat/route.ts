import { streamText, convertToModelMessages, UIMessage, stepCountIs } from 'ai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { tools } from '@/ai/tools';

const provider = createOpenAICompatible({
  name: 'dashscope',
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

const modelName = process.env.OPENAI_MODEL || 'qwen-plus';

export async function POST(request: Request) {
  const { messages }: { messages: UIMessage[] } = await request.json();

  const result = streamText({
    model: provider.chatModel(modelName),
    system: `你是一个专业的教学质量评价助手。你可以帮助用户查询和分析教师的教学评价、课堂表现及教学改进建议。
当用户询问某位教师的教学情况时，请调用 get_teaching_evaluation 工具来获取评价数据。
回复请使用中文，语言简洁专业。`,
    messages: await convertToModelMessages(messages),
    tools,
    /** 默认仅 1 步，工具调用后模型无法继续生成；多步才能「先调工具再总结」 */
    stopWhen: stepCountIs(5),
    /** 连接失败时减少重试轮次，避免长时间卡在「思考中」 */
    maxRetries: 1,
  });

  return result.toUIMessageStreamResponse();
}
