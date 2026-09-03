"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"

type Feedback = {
  id: string
  text: string
  createdAt: string
  status: string
  sentiment?: string
}

export default function InboxPage() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([])
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [sentimentFilter, setSentimentFilter] = useState("ALL")
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 10

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1) // Reset to page 1 on new search
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const fetchFeedback = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        q: debouncedSearch,
        status: statusFilter,
        sentiment: sentimentFilter,
        page: page.toString(),
        limit: limit.toString(),
      })
      const res = await fetch(`/api/feedback?${params.toString()}`)
      if (!res.ok) throw new Error("Failed to fetch feedback")
      const data = await res.json()
      
      // Formatting createdAt for UI since it's a DateTime string now
      const formatted = data.feedback.map((f: any) => ({
        ...f,
        createdAt: new Date(f.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })
      }))
      
      setFeedbackList(formatted)
      setTotal(data.total)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [debouncedSearch, statusFilter, sentimentFilter, page])

  useEffect(() => {
    fetchFeedback()
  }, [fetchFeedback])

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [statusFilter, sentimentFilter])

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      // Optimistic update
      setFeedbackList(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f))
      const res = await fetch(`/api/feedback/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) {
        throw new Error("Failed to update status")
      }
    } catch (err) {
      // Revert on error
      fetchFeedback()
      alert("Failed to update status")
    }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-blue-400">FEEDBACK</p>
          <h1 className="mt-1 text-3xl font-bold text-white">Feedback Inbox</h1>
          <p className="mt-1 text-sm text-slate-400">Review and understand what your customers are saying.</p>
        </div>
        
        <Link href="/inbox/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            + New Feedback
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <Input 
          placeholder="Search feedback..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-950 border-slate-700 text-white w-full sm:max-w-xs"
        />
        
        <Select value={statusFilter} onValueChange={(val) => val && setStatusFilter(val)}>
          <SelectTrigger className="w-[180px] bg-slate-950 border-slate-700 text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700 text-white">
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="NEW">New</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sentimentFilter} onValueChange={(val) => val && setSentimentFilter(val)}>
          <SelectTrigger className="w-[180px] bg-slate-950 border-slate-700 text-white">
            <SelectValue placeholder="Sentiment" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700 text-white">
            <SelectItem value="ALL">All Sentiments</SelectItem>
            <SelectItem value="positive">Positive</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="negative">Negative</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4 min-h-[400px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-12 text-center">
            <h2 className="text-base font-semibold text-red-400">Failed to load feedback</h2>
            <p className="mt-2 text-sm text-red-500/80">{error}</p>
            <Button onClick={fetchFeedback} variant="outline" className="mt-4 border-red-900/50 text-red-400 hover:bg-red-950/50">
              Try again
            </Button>
          </div>
        ) : feedbackList.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
            <h2 className="text-base font-semibold text-white">No feedback found</h2>
            <p className="mt-2 text-sm text-slate-400">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <>
            {feedbackList.map((feedback) => (
              <div key={feedback.id} className="rounded-xl border border-slate-800 bg-slate-900 p-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Select value={feedback.status} onValueChange={(val) => val && handleStatusChange(feedback.id, val)}>
                      <SelectTrigger className="w-[130px] h-6 text-xs bg-slate-800 text-slate-300 border-slate-700 rounded-full focus:ring-0">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700 text-white">
                        <SelectItem value="NEW">New</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                    {feedback.sentiment && (
                      <Badge variant="outline" className={`
                        ${feedback.sentiment === 'positive' ? 'text-green-400 border-green-900' : ''}
                        ${feedback.sentiment === 'negative' ? 'text-red-400 border-red-900' : ''}
                        ${feedback.sentiment === 'neutral' ? 'text-yellow-400 border-yellow-900' : ''}
                      `}>
                        {feedback.sentiment}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-white leading-relaxed">{feedback.text}</p>
                  <p className="mt-3 text-xs text-slate-500">{feedback.createdAt}</p>
                </div>
                <div className="sm:border-l border-slate-800 sm:pl-4 flex flex-col justify-center">
                  <Button variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-slate-400">
                  Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} results
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}