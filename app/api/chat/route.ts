import { smoothStream, streamText } from 'ai';
import { deepseek } from '@ai-sdk/deepseek';
import { ChatSDKError } from '@/lib/errors';
import { searchAndFormat } from '@/lib/fumadocs-search';

export const maxDuration = 60;

const isProductionEnvironment = process.env.NODE_ENV === 'production';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const systemPromptTemplate = `

## 你的角色
你是一个专业的文档助手，专门帮助用户理解和使用产品文档。

## 工作原则：
1. 优先基于文档内容回答问题，如果文档中没有相关信息，请明确说明并提供一般性建议
2. 支持中英文交流
3. 需给出完整的文档链接，文档链接组成：
https://docs.aibangxuanxing.com/docs/{page.path}
4. 输出格式：回答请以 Markdown 格式输出，要求结构清晰、易读。

## 相关文档内容：
{context}

`;

export async function POST(request: Request) {
  try {
    const json = await request.json();
    // console.log('Received request body:', json);

    const { messages } = json;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response('Invalid request: messages array is required', {
        status: 400,
      });
    }

    // Get the last user message as the search query
    const lastMessage = messages[messages.length - 1];
    const userQuery = lastMessage?.role === 'user' ? lastMessage.content : '';

    // console.log('🔍 Starting Fumadocs search for query:', userQuery);

    // Use intelligent multi-question search to retrieve relevant documents
    let documentContext = '暂无相关文档内容。';
    if (userQuery && userQuery.trim().length > 0) {
      try {
        documentContext = await searchAndFormat(userQuery.trim(), true, 6);
        // console.log('✅ Intelligent search completed with multi-question support');
      } catch (searchError) {
        console.error('❌ Intelligent search failed:', searchError);
        // Fallback to simple message
        documentContext = '搜索过程中出现错误，将基于一般知识回答您的问题。';
      }
    }

    // Build enhanced system prompt
    const enhancedSystemPrompt = systemPromptTemplate.replace(
      '{context}',
      documentContext,
    );

    // console.log('🤖 Sending enhanced prompt to AI model');
    // console.log('Context length:', documentContext.length);
    // console.log('documentContext:', documentContext);

    const result = streamText({
      model: deepseek('deepseek-chat'),
      system: enhancedSystemPrompt,
      messages,
      experimental_transform: smoothStream({ chunking: 'word' }),
      experimental_generateMessageId: generateUUID,
      experimental_telemetry: {
        isEnabled: isProductionEnvironment,
        functionId: 'stream-text',
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }
    return new Response('Internal Server Error', { status: 500 });
  }
}
