'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Calendar, Droplets, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CycleEntry {
  id: string
  user_id: string
  date: string
  flow_intensity: string | null
  symptoms: string[]
  notes: string | null
  created_at: string
}

interface CycleTrackerProps {
  initialEntries: CycleEntry[]
  userId: string
}

const flowOptions = [
  { value: 'none', label: 'None', color: 'bg-secondary' },
  { value: 'light', label: 'Light', color: 'bg-primary/30' },
  { value: 'medium', label: 'Medium', color: 'bg-primary/60' },
  { value: 'heavy', label: 'Heavy', color: 'bg-primary' },
]

const symptomOptions = [
  'Cramps', 'Headache', 'Bloating', 'Fatigue', 'Back pain',
  'Breast tenderness', 'Nausea', 'Acne', 'Insomnia', 'Cravings'
]

export function CycleTracker({ initialEntries, userId }: CycleTrackerProps) {
  const [entries, setEntries] = useState<CycleEntry[]>(initialEntries)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [flow, setFlow] = useState<string>('none')
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  
  const supabase = createClient()

  // Load existing entry for selected date
  const loadEntry = (date: string) => {
    const existing = entries.find(e => e.date === date)
    if (existing) {
      setFlow(existing.flow_intensity ?? 'none')
      setSymptoms(existing.symptoms ?? [])
      setNotes(existing.notes ?? '')
    } else {
      setFlow('none')
      setSymptoms([])
      setNotes('')
    }
    setSaved(false)
  }

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    loadEntry(date)
  }

  const toggleSymptom = (symptom: string) => {
    setSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    )
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)

    const { data, error } = await supabase
      .from('cycle_entries')
      .upsert({
        user_id: userId,
        date: selectedDate,
        flow_intensity: flow,
        symptoms,
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

  // Generate last 7 days for quick selection
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split('T')[0]
  })

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* Date Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Select Date
            </CardTitle>
            <CardDescription>Choose a date to log or view your cycle</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {last7Days.map((date) => {
                const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
                const dayNum = new Date(date).getDate()
                const hasEntry = entries.some(e => e.date === date)
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
                      hasEntry && !isSelected && 'bg-secondary'
                    )}
                  >
                    <span className="text-xs text-muted-foreground">{dayName}</span>
                    <span className="text-lg font-semibold">{dayNum}</span>
                    {hasEntry && (
                      <div className="w-2 h-2 rounded-full bg-primary mt-1" />
                    )}
                  </button>
                )
              })}
            </div>
            <div className="mt-4">
              <Label htmlFor="date-picker">Or pick a date</Label>
              <input
                id="date-picker"
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="mt-1 w-full px-3 py-2 border rounded-lg bg-background"
              />
            </div>
          </CardContent>
        </Card>

        {/* Flow Intensity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="w-5 h-5" />
              Flow Intensity
            </CardTitle>
            <CardDescription>Select your flow level for this day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {flowOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => { setFlow(option.value); setSaved(false) }}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                    flow === option.value 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <div className={cn('w-8 h-8 rounded-full', option.color)} />
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Symptoms */}
        <Card>
          <CardHeader>
            <CardTitle>Symptoms</CardTitle>
            <CardDescription>Select any symptoms you experienced</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {symptomOptions.map((symptom) => (
                <Badge
                  key={symptom}
                  variant={symptoms.includes(symptom) ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer text-sm py-1.5 px-3 transition-all',
                    symptoms.includes(symptom) && 'bg-primary'
                  )}
                  onClick={() => toggleSymptom(symptom)}
                >
                  {symptom}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>Add any additional notes about your day</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="How are you feeling today?"
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

      {/* Recent Entries Sidebar */}
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
            <CardDescription>Your cycle history</CardDescription>
          </CardHeader>
          <CardContent>
            {entries.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No entries yet. Start tracking today!
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {entries.slice(0, 10).map((entry) => (
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
                      <Badge variant="secondary" className="capitalize text-xs">
                        {entry.flow_intensity}
                      </Badge>
                    </div>
                    {entry.symptoms && entry.symptoms.length > 0 && (
                      <p className="text-xs text-muted-foreground truncate">
                        {entry.symptoms.slice(0, 3).join(', ')}
                        {entry.symptoms.length > 3 && '...'}
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
