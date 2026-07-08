import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardNav } from '@/components/dashboard-nav'
import { GlowHeart } from '@/components/glow-heart'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', user.id)
    .single()
  return (
    <div className="relative min-h-screen flex flex-col">
      <GlowHeart className="absolute inset-0 -z-10" />
      <DashboardNav 
        userEmail={user.email ?? ''} 
        displayName={profile?.display_name ?? user.email?.split('@')[0] ?? 'User'} 
      />
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
