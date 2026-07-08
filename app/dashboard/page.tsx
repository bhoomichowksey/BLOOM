import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Smile, MessageCircle, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { GlowHeart } from '@/components/glow-heart'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const today = new Date().toISOString().split('T')[0]
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  // Fetch recent data
  const [cycleData, moodData, chatCount] = await Promise.all([
    supabase
      .from('cycle_entries')
      .select('*')
      .eq('user_id', user?.id)
      .gte('date', thirtyDaysAgo)
      .order('date', { ascending: false }),
    supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', user?.id)
      .gte('date', thirtyDaysAgo)
      .order('date', { ascending: false }),
    supabase
      .from('chat_messages')
      .select('id', { count: 'exact' })
      .eq('user_id', user?.id),
  ])

  const todayCycle = cycleData.data?.find(e => e.date === today)
  const todayMood = moodData.data?.find(e => e.date === today)
  const avgMood = moodData.data?.length 
    ? (moodData.data.reduce((sum, e) => sum + (e.mood_score || 0), 0) / moodData.data.length).toFixed(1)
    : null

  return (
    <div className="relative">
      <GlowHeart className="absolute inset-0 -z-10" />
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-balance">Welcome back</h1>
          <p className="text-muted-foreground">{"Here's your wellness overview for today"}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/cycle">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Cycle Tracker</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {todayCycle ? (
                    <span className="capitalize">{todayCycle.flow_intensity}</span>
                  ) : (
                    <span className="text-muted-foreground text-lg">No entry today</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {cycleData.data?.length ?? 0} entries this month
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/mood">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{"Today's Mood"}</CardTitle>
                <Smile className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {todayMood ? (
                    <span>{['', 'Very Low', 'Low', 'Neutral', 'Good', 'Great'][todayMood.mood_score ?? 3]}</span>
                  ) : (
                    <span className="text-muted-foreground text-lg">Not logged</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tap to log your mood
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/chat">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">AI Assistant</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Ask Bloom</div>
                <p className="text-xs text-muted-foreground">
                  {chatCount.count ?? 0} conversations
                </p>
              </CardContent>
            </Card>
          </Link>

          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Monthly Average</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {avgMood ? (
                  <span>{avgMood}/5</span>
                ) : (
                  <span className="text-muted-foreground text-lg">No data</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Mood score average
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Track your wellness in just a few taps</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Link 
                href="/dashboard/cycle" 
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Log Cycle</p>
                  <p className="text-sm text-muted-foreground">Track your period and symptoms</p>
                </div>
              </Link>
              <Link 
                href="/dashboard/mood" 
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-accent/30 flex items-center justify-center">
                  <Smile className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-medium">Track Mood</p>
                  <p className="text-sm text-muted-foreground">How are you feeling today?</p>
                </div>
              </Link>
              <Link 
                href="/dashboard/chat" 
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-chart-3/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-chart-3" />
                </div>
                <div>
                  <p className="font-medium">Chat with Bloom</p>
                  <p className="text-sm text-muted-foreground">Get personalized health insights</p>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Wellness Tips</CardTitle>
              <CardDescription>Daily insights for your health journey</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-sm font-medium text-primary mb-1">Stay Hydrated</p>
                <p className="text-sm text-muted-foreground">
                  Drinking enough water can help reduce bloating and improve energy levels during your cycle.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                <p className="text-sm font-medium text-accent-foreground mb-1">Mindful Movement</p>
                <p className="text-sm text-muted-foreground">
                  Gentle exercise like yoga or walking can help ease cramps and boost your mood naturally.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
