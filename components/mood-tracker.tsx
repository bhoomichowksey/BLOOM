'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Check, Zap, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MoodEntry {
  id: string
  user_id: string
  date: string
  mood_score: number | null
  energy_level: number | null
  emotions: string[]
  notes: string | null
  created_at: string
}

interface MoodTrackerProps {
  initialEntries: MoodEntry[]
  userId: string
}

const moodOptions = [
  { value: 1, label: 'Very Low', color: 'bg-chart-5' },
  { value: 2, label: 'Low', color: 'bg-chart-2/70' },
  { value: 3, label: 'Neutral', color: 'bg-chart-4' },
  { value: 4, label: 'Good', color: 'bg-chart-3' },
  { value: 5, label: 'Great', color: 'bg-primary' },
]

const energyOptions = [
  { value: 1, label: 'Exhausted' },
  { value: 2, label: 'Tired' },
  { value: 3, label: 'Okay' },
  { value: 4, label: 'Energized' },
  { value: 5, label: 'Very High' },
]

const emotionOptions = [
  'Happy', 'Calm', 'Anxious', 'Sad', 'Stressed',
  'Grateful', 'Irritated', 'Hopeful', 'Overwhelmed', 'Content',
  'Excited', 'Lonely', 'Motivated', 'Frustrated', 'Peaceful'
]

export function MoodTracker({ initialEntries, userId }: MoodTrackerProps) {
  const [entries, setEntries] = useState<MoodEntry[]>(initialEntries)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [mood, setMood] = useState<number>(3)
  const [energy, setEnergy] = useState<number>(3)
  const [emotions, setEmotions] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  
  const supabase = createClient()

  const loadEntry = (date: string) => {
    const existing = entries.find(e => e.date === date)
    if (existing) {
      setMood(existing.mood_score ?? 3)
      setEnergy(existing.energy_level ?? 3)
      setEmotions(existing.emotions ?? [])
      setNotes(existing.notes ?? '')
    } else {
      setMood(3)
      setEnergy(3)
      setEmotions([])
      setNotes('')
    }
    setSaved(false)
  }

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    loadEntry(date)
  }

  const toggleEmotion = (emotion: string) => {
    setEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    )
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)

    const { data, error } = await supabase
      .from('mood_entries')
      .upsert({
        user_id: userId,
        date: selectedDate,
        mood_score: mood,
        energy_level: energy,
        emotions,
        notes: notes || null,
      }, { onConflict: 'user_id,date' })
      .select()
      .single()

    if (!error && data) {
      setEntries(prev => {
        const filtered = prev.filter(e => e.date !== selectedDate)
        return [data, ...filtered].sort((a, b) => b.date.localeCompare(a.date))
      })
      setSaved(true)
    }

    setSaving(false)
  }

  // Generate last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split('T')[0]
  })

  // Calculate stats
  const avgMood = entries.length 
    ? (entries.reduce((sum, e) => sum + (e.mood_score || 0), 0) / entries.length).toFixed(1)
    : null

  const avgEnergy = entries.length
    ? (entries.reduce((sum, e) => sum + (e.energy_level || 0), 0) / entries.length).toFixed(1)
    : null

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* Date Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {last7Days.map((date) => {
                const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
                const dayNum = new Date(date).getDate()
                const entry = entries.find(e => e.date === date)
                const isSelected = date === selectedDate
                
                return (
                  <button
                    key={date}
                    onClick={() => handleDateChange(date)}
                    className={cn(
                      'flex flex-col items-center p-3 rounded-lg border-2 transition-all min-w-[60px]',
                      isSelected 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50',
                      entry && !isSelected && 'bg-secondary'
                    )}
                  >
                    <span className="text-xs text-muted-foreground">{dayName}</span>
                    <span className="text-lg font-semibold">{dayNum}</span>
                    {entry && (
                      <div className={cn(
                        'w-3 h-3 rounded-full mt-1',
                        moodOptions.find(m => m.value === entry.mood_score)?.color ?? 'bg-muted'
                      )} />
                    )}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Mood Selection */}
        <Card>
          <CardHeader>
            <CardTitle>How are you feeling?</CardTitle>
            <CardDescription>Rate your overall mood today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 justify-center">
              {moodOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => { setMood(option.value); setSaved(false) }}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all min-w-[80px]',
                    mood === option.value 
                      ? 'border-primary bg-primary/5 scale-105' 
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <div className={cn('w-12 h-12 rounded-full flex items-center justify-center text-white font-bold', option.color)}>
                    {option.value}
                  </div>
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Energy Level */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Energy Level
            </CardTitle>
            <CardDescription>How energized do you feel?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2 justify-between">
                {energyOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => { setEnergy(option.value); setSaved(false) }}
                    className={cn(
                      'flex-1 py-3 px-2 rounded-lg border-2 transition-all text-sm font-medium',
                      energy === option.value 
                        ? 'border-accent bg-accent/20 text-accent-foreground' 
                        : 'border-border hover:border-accent/50'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emotions */}
        <Card>
          <CardHeader>
            <CardTitle>Emotions</CardTitle>
            <CardDescription>Select all emotions that apply</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {emotionOptions.map((emotion) => (
                <Badge
                  key={emotion}
                  variant={emotions.includes(emotion) ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer text-sm py-1.5 px-3 transition-all',
                    emotions.includes(emotion) && 'bg-primary'
                  )}
                  onClick={() => toggleEmotion(emotion)}
                >
                  {emotion}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Journal</CardTitle>
            <CardDescription>Write about your day or thoughts</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="What's on your mind today?"
              value={notes}
              onChange={(e) => { setNotes(e.target.value); setSaved(false) }}
              rows={4}
            />
          </CardContent>
        </Card>

        <Button 
          onClick={handleSave} 
          disabled={saving}
          size="lg"
          className="w-full sm:w-auto"
        >
          {saving ? 'Saving...' : saved ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Saved
            </>
          ) : 'Save Entry'}
        </Button>
      </div>

      {/* Stats & History Sidebar */}
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              30-Day Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-secondary">
              <span className="text-sm text-muted-foreground">Avg Mood</span>
              <span className="font-bold text-lg">{avgMood ?? '-'}/5</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-secondary">
              <span className="text-sm text-muted-foreground">Avg Energy</span>
              <span className="font-bold text-lg">{avgEnergy ?? '-'}/5</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-secondary">
              <span className="text-sm text-muted-foreground">Entries</span>
              <span className="font-bold text-lg">{entries.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
          </CardHeader>
          <CardContent>
            {entries.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No entries yet. Start tracking today!
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {entries.slice(0, 7).map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => handleDateChange(entry.date)}
                    className={cn(
                      'text-left p-3 rounded-lg border transition-colors',
                      entry.date === selectedDate 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:bg-secondary'
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">
                        {new Date(entry.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          'w-4 h-4 rounded-full',
                          moodOptions.find(m => m.value === entry.mood_score)?.color ?? 'bg-muted'
                        )} />
                        <span className="text-sm text-muted-foreground">
                          {entry.mood_score}/5
                        </span>
                      </div>
                    </div>
                    {entry.emotions && entry.emotions.length > 0 && (
                      <p className="text-xs text-muted-foreground truncate">
                        {entry.emotions.slice(0, 3).join(', ')}
                        {entry.emotions.length > 3 && '...'}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
