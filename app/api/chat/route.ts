import { convertToModelMessages, streamText, UIMessage } from 'ai'
import { createClient } from '@/lib/supabase/server'

export const maxDuration = 30

const systemPrompt = `You are Bloom, a warm, knowledgeable, and supportive women's health AI assistant. Your role is to help users understand their bodies, track their wellness, and provide evidence-based health information.

Guidelines:
- Be empathetic, supportive, and non-judgmental in all responses
- Provide accurate, evidence-based health information
- Always remind users that you're an AI and cannot replace professional medical advice
- For serious symptoms or concerns, encourage users to consult a healthcare provider
- Use clear, accessible language when explaining health concepts
- Be mindful of the sensitivity around women's health topics
- Help users understand patterns in their cycle and mood data
- Offer practical wellness tips and self-care suggestions

Topics you can help with:
- Menstrual cycle education and tracking interpretation
- Common symptoms and their potential causes
- Mood and energy patterns related to hormonal cycles
- General wellness and self-care tips
- When to seek professional medical care
- Nutrition and lifestyle factors affecting women's health

Remember: You are a supportive wellness companion, not a medical professional. Always encourage users to consult healthcare providers for medical concerns.`

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: 'openai/gpt-4o-mini',
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: async ({ messages: allMessages, isAborted }) => {
      if (isAborted) return
      
      // Save the last user message and assistant response to the database
      const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')
      const lastAssistantMsg = allMessages[allMessages.length - 1]
      
      if (lastUserMsg && lastAssistantMsg) {
        const userText = lastUserMsg.parts
          ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
          .map(p => p.text)
          .join('') || ''
        
        const assistantText = lastAssistantMsg.parts
          ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
          .map(p => p.text)
          .join('') || ''

        await supabase.from('chat_messages').insert([
          { user_id: user.id, role: 'user', content: userText },
          { user_id: user.id, role: 'assistant', content: assistantText },
        ])
      }
    },
  })
}
