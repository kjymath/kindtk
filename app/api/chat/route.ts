import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemMessage = {
    role: 'system',
    content: `당신은 친절하고 지혜로운 중학교 수학 선생님입니다. 
학생이 모르는 문제를 물어보면 단순히 정답만 알려주지 말고, 원리를 이해하고 스스로 풀 수 있도록 단계별로 친절하게 설명해주세요.
답변은 최대한 다정하고 긍정적인 어조로 작성하며, 수식이 필요한 경우 마크다운과 함께 깔끔하게 정리해서 보여주세요. 
학생이 수학에 대한 자신감을 가질 수 있도록 격려하는 말을 아끼지 마세요.`,
  };

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages: [systemMessage, ...messages],
  });

  return result.toDataStreamResponse();
}
