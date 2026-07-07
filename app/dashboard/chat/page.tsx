import { createClient } from '@/lib/supabase/server'
import { SymptomChat } from '@/components/symptom-chat'

export default async function ChatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get recent chat history for context
  const { data: chatHistory } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-10rem)]">
      <div>
        <h1 className="text-2xl font-semibold">Chat with Bloom</h1>
        <p className="text-muted-foreground">Your AI wellness companion</p>
      </div>
      <SymptomChat initialHistory={chatHistory?.reverse() ?? []} />
    </div>
  )
}
