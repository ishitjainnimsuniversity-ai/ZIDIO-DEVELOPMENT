"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Feedback = {
  id: string;
  text: string;
  createdAt: string;
};

const themes = [
  "process",
  "support",
  "service",
  "price",
  "payment",
  "quality",
  "delivery",
  "product",
];

export default function TrendsPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedback = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/feedback?limit=1000");
      if (!res.ok) throw new Error("Failed to fetch feedback");
      const data = await res.json();
      setFeedback(data.feedback || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  // Count how many times each theme appears
  const themeCounts = themes
    .map((theme) => ({
      theme,
      count: feedback.filter((item) =>
        item.text.toLowerCase().includes(theme)
      ).length,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);

  if (isLoading) {
    return (
      <main className="p-6 md:p-10 max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
        <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-12 text-center">
          <h2 className="text-base font-semibold text-red-400">Failed to load trends</h2>
          <p className="mt-2 text-sm text-red-500/80">{error}</p>
          <Button onClick={fetchFeedback} variant="outline" className="mt-4 border-red-900/50 text-red-400 hover:bg-red-950/50">
            Try again
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="text-white p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-medium text-blue-400">INSIGHTS</p>

        <h1 className="mt-2 text-3xl font-bold">Feedback Trends</h1>

        <p className="mt-2 text-slate-400">
          Discover the topics your customers talk about most.
        </p>

        {themeCounts.length === 0 ? (
          <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-12 text-center">
            <h2 className="text-lg font-semibold">No trends yet</h2>
            <p className="mt-2 text-slate-400">
              Add more customer feedback to discover trends and themes.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {themeCounts.map((item) => (
              <div
                key={item.theme}
                className="rounded-xl border border-slate-800 bg-slate-900 p-6"
              >
                <p className="capitalize text-xl font-semibold">
                  {item.theme}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  Mentioned {item.count}{" "}
                  {item.count === 1 ? "time" : "times"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}