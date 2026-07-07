import { createClient } from '@/lib/supabase/server'
import { CycleTracker } from '@/components/cycle-tracker'

export default async function CyclePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const { data: cycleEntries } = await supabase
    .from('cycle_entries')
    .select('*')
    .eq('user_id', user?.id)
    .gte('date', thirtyDaysAgo)
    .order('date', { ascending: false })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Cycle Tracker</h1>
        <p className="text-muted-foreground">Track your period and symptoms</p>
      </div>
      <CycleTracker initialEntries={cycleEntries ?? []} userId={user?.id ?? ''} />
    </div>
  )
}
