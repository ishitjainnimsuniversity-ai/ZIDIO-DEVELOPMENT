"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"

const COLORS = {
  positive: "#4ade80",
  negative: "#f87171",
  neutral: "#facc15"
}

type AnalyticsData = {
  totalFeedback: number
  sentimentCounts: {
    positive: number
    negative: number
    neutral: number
  }
  unanalyzed: number
  volumeData: {
    date: string
    count: number
  }[]
}

export default function DashboardPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/analytics')
      if (!res.ok) throw new Error("Failed to fetch analytics")
      const json = await res.json()
      setData(json)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  if (isLoading) {
    return (
      <main className="p-6 md:p-10 max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </main>
    )
  }

  if (error || !data) {
    return (
      <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
        <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-12 text-center">
          <h2 className="text-base font-semibold text-red-400">Failed to load analytics</h2>
          <p className="mt-2 text-sm text-red-500/80">{error}</p>
          <Button onClick={fetchAnalytics} variant="outline" className="mt-4 border-red-900/50 text-red-400 hover:bg-red-950/50">
            Try again
          </Button>
        </div>
      </main>
    )
  }

  const { totalFeedback, sentimentCounts, unanalyzed, volumeData } = data

  const sentimentData = [
    { name: 'Positive', value: sentimentCounts.positive, color: COLORS.positive },
    { name: 'Negative', value: sentimentCounts.negative, color: COLORS.negative },
    { name: 'Neutral', value: sentimentCounts.neutral, color: COLORS.neutral },
  ].filter(d => d.value > 0)

  return (
    <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-wider text-blue-400">OVERVIEW</p>
        <h1 className="mt-1 text-3xl font-bold text-white">Analytics Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">Understand what your customers are saying at a glance.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalFeedback}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Positive Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">{sentimentCounts.positive}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Negative Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">{sentimentCounts.negative}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Unanalyzed Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-400">{unanalyzed}</div>
            <p className="text-xs text-slate-500 mt-1">Pending sentiment analysis</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Feedback Volume</CardTitle>
            <CardDescription className="text-slate-400">Submissions over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: "#3b82f6" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Sentiment Breakdown</CardTitle>
            <CardDescription className="text-slate-400">Distribution of customer sentiment</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex flex-col items-center justify-center">
            {sentimentData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-500">Not enough data to display sentiment.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Top Themes</CardTitle>
          <CardDescription className="text-slate-400">Most frequently mentioned topics across feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/50 p-8 text-center">
            <h3 className="text-sm font-medium text-slate-300">Theme extraction not implemented</h3>
            <p className="mt-1 text-sm text-slate-500">
              Automatic thematic analysis requires a backend extraction engine which has not yet been integrated.
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}