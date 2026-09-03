"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewFeedbackPage() {
  const router = useRouter()
  const [text, setText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return

    setIsSubmitting(true)
    
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          status: "NEW",
        })
      })

      if (!res.ok) {
        throw new Error("Failed to save feedback")
      }

      router.push("/inbox")
    } catch (error) {
      alert("Error saving feedback. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="p-6 md:p-10 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Add Feedback</h1>
        <p className="text-slate-400 mt-2">Manually log a new piece of customer feedback.</p>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Feedback Details</CardTitle>
          <CardDescription className="text-slate-400">
            Paste the raw feedback from the customer here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Feedback Text</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                rows={6}
                placeholder="The customer said..."
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !text.trim()}
                className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Feedback"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
