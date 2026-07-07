import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Calendar, Smile, MessageCircle, Shield, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary" />
              </div>
              <span className="font-semibold text-lg">Bloom</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Your Personal Wellness Companion
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
            Understand Your Body,{' '}
            <span className="text-primary">Embrace Your Journey</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-balance">
            Track your cycle, monitor your mood, and get personalized health insights 
            with AI-powered support designed for women&apos;s wellness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="w-full sm:w-auto">
                Start Your Journey
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Comprehensive tools to support your health and wellness journey
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 bg-card shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Cycle Tracker</CardTitle>
                <CardDescription>
                  Log your period, track flow intensity, and monitor symptoms with our intuitive calendar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground flex flex-col gap-2">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Period and flow tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Symptom logging
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Pattern insights
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-accent/30 flex items-center justify-center mb-4">
                  <Smile className="w-6 h-6 text-accent-foreground" />
                </div>
                <CardTitle>Mood Tracker</CardTitle>
                <CardDescription>
                  Monitor your emotional wellbeing and energy levels to understand your patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground flex flex-col gap-2">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Daily mood logging
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Energy tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Emotion journaling
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-chart-3/20 flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-chart-3" />
                </div>
                <CardTitle>AI Health Chat</CardTitle>
                <CardDescription>
                  Get answers to your health questions from our supportive AI wellness companion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground flex flex-col gap-2">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-chart-3" />
                    24/7 health support
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-chart-3" />
                    Symptom guidance
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-chart-3" />
                    Wellness tips
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Your Privacy Matters</h2>
              <p className="text-muted-foreground mb-6">
                Your health data is personal and sensitive. We use industry-standard 
                security practices to keep your information safe and private. Your data 
                is encrypted and never shared with third parties.
              </p>
              <ul className="flex flex-col gap-3">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>End-to-end encryption</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>No data selling - ever</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Full data control and deletion</span>
                </li>
              </ul>
            </div>
            <div className="flex-1 w-full">
              <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                <CardContent className="p-8">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-primary mb-2">100%</p>
                    <p className="text-muted-foreground">Privacy Focused</p>
                  </div>
                  <div className="mt-6 pt-6 border-t border-border/50 grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold">256-bit</p>
                      <p className="text-xs text-muted-foreground">Encryption</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">HIPAA</p>
                      <p className="text-xs text-muted-foreground">Compliant</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Join thousands of women taking control of their health journey. 
            Sign up today and start tracking your wellness.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg">Create Free Account</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-3 h-3 text-primary" />
              </div>
              <span className="font-medium">Bloom</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Bloom is not a substitute for professional medical advice. 
              Always consult a healthcare provider for medical concerns.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
