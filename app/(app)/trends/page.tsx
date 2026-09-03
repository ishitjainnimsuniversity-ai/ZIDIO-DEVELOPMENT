"use client";

import { useEffect, useState } from "react";
import { Loader2, TrendingUp, Sparkles, RefreshCw, BarChart3, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Feedback = {
  id: string;
  text?: string;
  rawText?: string;
  sentiment?: string;
  featureArea?: string;
  createdAt?: string;
};

const defaultKeywords = [
  "payment",
  "billing",
  "support",
  "login",
  "mobile",
  "crash",
  "pricing",
  "speed",
  "search",
  "service",
];

export default function TrendsPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [themes, setThemes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrendsData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [feedbackRes, themesRes] = await Promise.all([
        fetch("/api/feedback?limit=1000"),
        fetch("/api/analytics/themes")
      ]);

      if (!feedbackRes.ok) throw new Error("Failed to fetch feedback");

      const feedbackData = await feedbackRes.json();
      setFeedback(feedbackData.feedback || feedbackData.items || []);

      if (themesRes.ok) {
        const themesData = await themesRes.json();
        setThemes(themesData.data || themesData.themes || []);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendsData();
  }, []);

  // Safe theme keyword occurrences calculation (guaranteed zero null-pointer crashes)
  const themeCounts = defaultKeywords
    .map((keyword) => {
      const matches = feedback.filter((item) => {
        const content = (item.text || item.rawText || "").toLowerCase();
        return content.includes(keyword.toLowerCase());
      });
      return {
        theme: keyword,
        count: matches.length,
      };
    })
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);

  if (isLoading) {
    return (
      <main className="p-6 md:p-10 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-sm text-slate-400">Analyzing feedback clusters & trends...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
        <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-12 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h2 className="text-base font-semibold text-red-400">Failed to load trends</h2>
          <p className="mt-2 text-sm text-red-500/80">{error}</p>
          <Button
            onClick={fetchTrendsData}
            variant="outline"
            className="mt-4 border-red-900/50 text-red-400 hover:bg-red-950/50"
          >
            <RefreshCw className="w-4 h-4 mr-1.5" /> Try again
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="text-white p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-2">
            <TrendingUp className="w-3.5 h-3.5" /> THEMATIC CLUSTERING
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Feedback Trends</h1>
          <p className="mt-1 text-sm text-slate-400">
            Real-time keyword frequency and AI-identified customer pain points across 150+ records.
          </p>
        </div>

        <Button
          onClick={fetchTrendsData}
          variant="outline"
          className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh Data
        </Button>
      </div>

      {/* AI Discovered Themes */}
      {themes.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" /> AI Discovered Problem Areas
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {themes.slice(0, 6).map((theme: any) => (
              <div
                key={theme.id || theme.name}
                className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 hover:border-purple-500/40 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-white text-base">{theme.name}</h3>
                  <Badge variant="outline" className="text-purple-400 border-purple-900/50 bg-purple-950/20">
                    {theme.count} mentions
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-slate-400 line-clamp-2">
                  {theme.description || "Aggregated customer feedback concerning " + theme.name}
                </p>
                {theme.sentimentBreakdown && (
                  <div className="mt-4 flex gap-3 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                    <span className="text-emerald-400 font-medium">+{theme.sentimentBreakdown.positive} Pos</span>
                    <span className="text-rose-400 font-medium">-{theme.sentimentBreakdown.negative} Neg</span>
                    <span className="text-amber-400 font-medium">~{theme.sentimentBreakdown.neutral} Neu</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Keyword Frequency Breakdown */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-400" /> Top Keyword Frequencies
        </h2>

        {themeCounts.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-12 text-center">
            <h3 className="text-lg font-semibold">No trends yet</h3>
            <p className="mt-2 text-sm text-slate-400">
              Add more customer feedback to discover trends and themes.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {themeCounts.map((item) => (
              <div
                key={item.theme}
                className="rounded-xl border border-slate-800 bg-slate-900 p-5 hover:border-blue-500/40 transition flex items-center justify-between"
              >
                <div>
                  <p className="capitalize text-lg font-bold text-white">{item.theme}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Frequency: {item.count} {item.count === 1 ? "match" : "matches"}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-bold text-blue-400 text-sm">
                  {item.count}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}