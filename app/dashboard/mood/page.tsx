import { createClient } from '@/lib/supabase/server'
import { MoodTracker } from '@/components/mood-tracker'

export default async function MoodPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const { data: moodEntries } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('user_id', user?.id)
    .gte('date', thirtyDaysAgo)
    .order('date', { ascending: false })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Mood Tracker</h1>
        <p className="text-muted-foreground">Track your emotional wellbeing</p>
      </div>
      <MoodTracker initialEntries={moodEntries ?? []} userId={user?.id ?? ''} />
    </div>
  )
}
