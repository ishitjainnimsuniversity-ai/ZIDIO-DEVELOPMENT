"use client";

import { useEffect, useState } from "react";
import { Loader2, Download, AlertCircle, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type AnalyticsData = {
  totalFeedback: number;
  sentimentCounts: { positive: number; negative: number; neutral: number };
  unanalyzed: number;
  volumeData: { date: string; count: number }[];
};

type Feedback = {
  id: string;
  text: string;
  sentiment: string | null;
  status: string;
  createdAt: string;
};

export default function ReportsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentFeedback, setRecentFeedback] = useState<Feedback[]>([]);
  const [aiNarrative, setAiNarrative] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReportData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [analyticsRes, feedbackRes] = await Promise.all([
        fetch("/api/analytics"),
        fetch("/api/feedback?limit=6")
      ]);

      if (!analyticsRes.ok || !feedbackRes.ok) {
        throw new Error("Failed to load report data");
      }

      const analyticsData = await analyticsRes.json();
      const feedbackData = await feedbackRes.json();

      setAnalytics(analyticsData);
      setRecentFeedback(feedbackData.feedback || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAiVocReport = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch("/api/reports/voc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ period: "Last 30 Days" }),
      });

      if (!res.ok) throw new Error("Failed to generate AI report");
      const data = await res.json();
      setAiNarrative(data.report?.aiNarrative || data.aiNarrative || "Report generated successfully.");
    } catch (err: any) {
      alert("Error generating report: " + err.message);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <main className="p-6 md:p-10 max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </main>
    );
  }

  if (error || !analytics) {
    return (
      <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
        <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-12 text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <h2 className="text-base font-semibold text-red-400">Failed to load report</h2>
          <p className="mt-2 text-sm text-red-500/80">{error}</p>
          <Button onClick={fetchReportData} variant="outline" className="mt-4 border-red-900/50 text-red-400 hover:bg-red-950/50">
            Try again
          </Button>
        </div>
      </main>
    );
  }

  const dateRange = analytics.volumeData.length > 0
    ? `${analytics.volumeData[0].date} - ${analytics.volumeData[analytics.volumeData.length - 1].date}`
    : new Date().toLocaleDateString();

  return (
    <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 pb-24 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-0.5 text-xs font-semibold text-blue-400 mb-2">
            <Sparkles className="h-3.5 w-3.5" /> VOICE OF CUSTOMER AI ENGINE
          </div>
          <h1 className="text-3xl font-bold">Voice of Customer Executive Report</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Generated on {new Date().toLocaleDateString()} &bull; Period: {dateRange}
          </p>
        </div>
        <div className="flex items-center gap-3 print:hidden">
          <Button
            onClick={generateAiVocReport}
            disabled={isGeneratingAi}
            className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 transition"
          >
            {isGeneratingAi ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Synthesizing AI...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Generate AI VOC Report
              </>
            )}
          </Button>
          <Button onClick={handlePrint} variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800 gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
        <Card className="bg-slate-900/80 border-slate-800 col-span-2 md:col-span-1">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">Total Feedback</CardDescription>
            <CardTitle className="text-2xl text-white">{analytics.totalFeedback}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-slate-900/80 border-slate-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-emerald-400">Positive</CardDescription>
            <CardTitle className="text-2xl text-white">{analytics.sentimentCounts.positive}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-slate-900/80 border-slate-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">Neutral</CardDescription>
            <CardTitle className="text-2xl text-white">{analytics.sentimentCounts.neutral}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-slate-900/80 border-slate-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-rose-400">Negative</CardDescription>
            <CardTitle className="text-2xl text-white">{analytics.sentimentCounts.negative}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-slate-900/80 border-slate-800 opacity-80">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">Unanalyzed</CardDescription>
            <CardTitle className="text-2xl text-white">{analytics.unanalyzed}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Key Insights (AI Generated) */}
          <Card className="bg-slate-900/80 border-blue-900/50 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-400" /> Executive AI Narrative
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Synthesized from customer feedback items across the workspace
                  </CardDescription>
                </div>
                {!aiNarrative && (
                  <Button
                    onClick={generateAiVocReport}
                    disabled={isGeneratingAi}
                    size="sm"
                    variant="outline"
                    className="border-blue-500/40 text-blue-400 hover:bg-blue-950/40 print:hidden text-xs"
                  >
                    Generate Now
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isGeneratingAi ? (
                <div className="p-8 text-center text-slate-400 space-y-3">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-400" />
                  <p className="text-sm">Synthesizing Voice-of-Customer intelligence...</p>
                </div>
              ) : aiNarrative ? (
                <div className="space-y-4 text-slate-200 leading-relaxed font-sans whitespace-pre-wrap text-sm">
                  {aiNarrative}
                </div>
              ) : (
                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-6 text-center text-slate-400 space-y-3">
                  <p className="text-sm">
                    Click <strong>Generate AI VOC Report</strong> above to synthesize key friction points, positive sentiment drivers, and tactical engineering recommendations.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Volume Trend Chart */}
          <Card className="bg-slate-900/80 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-base">Feedback Volume Trajectory</CardTitle>
              <CardDescription className="text-slate-400">Daily incoming volume distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.volumeData}>
                    <XAxis 
                      dataKey="date" 
                      stroke="#475569" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#475569" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f8fafc' }}
                      itemStyle={{ color: '#3b82f6' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#3b82f6" 
                      strokeWidth={2.5} 
                      dot={{ fill: '#3b82f6', r: 3 }}
                      activeDot={{ r: 5 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Supporting Evidence Column */}
        <div className="space-y-8">
          <Card className="bg-slate-900/80 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-base">Recent Verbatim Feedback</CardTitle>
              <CardDescription className="text-slate-400">Supporting customer evidence</CardDescription>
            </CardHeader>
            <CardContent>
              {recentFeedback.length === 0 ? (
                <div className="text-sm text-slate-500 text-center py-4">No recent feedback to display.</div>
              ) : (
                <div className="space-y-3">
                  {recentFeedback.map((fb) => (
                    <div key={fb.id} className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 text-xs">
                      <p className="text-slate-300 italic line-clamp-3">"{fb.text}"</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500">
                          {new Date(fb.createdAt).toLocaleDateString()}
                        </span>
                        {fb.sentiment && (
                          <Badge variant="outline" className={`text-[10px] ${
                            fb.sentiment.toLowerCase() === 'positive' ? 'border-emerald-800 text-emerald-400' :
                            fb.sentiment.toLowerCase() === 'negative' ? 'border-rose-800 text-rose-400' :
                            'border-slate-700 text-slate-300'
                          }`}>
                            {fb.sentiment.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Print-only footer */}
      <div className="hidden print:block text-center text-xs text-slate-500 pt-8 mt-8 border-t border-slate-800">
        Internal Confidential • Generated by LOOP Voice of Customer Analytics Platform
      </div>
    </main>
  );
}
