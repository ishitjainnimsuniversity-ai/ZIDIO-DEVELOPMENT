"use client";

import { useEffect, useState, useRef } from "react";
import { Loader2, Volume2, Square, Mic, MicOff, Sparkles, CheckCircle2, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

type EvidenceItem = {
  id: string;
  source: string;
  text: string;
  sentiment?: string;
  similarity: number;
};

export default function AskPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [isAsking, setIsAsking] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [sttSupported, setSttSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSpeechSupported("speechSynthesis" in window);
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      setSttSupported(!!SpeechRecognition);
    }
  }, []);

  const handleAsk = async (queryText?: string) => {
    const activeQuery = queryText || question;
    if (!activeQuery.trim()) {
      alert("Please enter a question.");
      return;
    }

    setIsAsking(true);
    setError(null);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }

    try {
      const res = await fetch("/api/ask-loop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: activeQuery }),
      });

      if (!res.ok) {
        throw new Error("Failed to get answer from Ask LOOP AI");
      }

      const data = await res.json();
      setAnswer(data.answer || "No response received.");
      setEvidence(data.evidence || []);
    } catch (err: any) {
      setError(err.message || "An error occurred while answering.");
    } finally {
      setIsAsking(false);
    }
  };

  const handleToggleVoice = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    if (!answer) return;

    window.speechSynthesis.cancel();
    const cleanSpeech = answer.replace(/[#*`_•\-]/g, " ").replace(/\s+/g, " ").trim();
    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.0;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handleToggleMic = () => {
    if (!sttSupported) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuestion(transcript);
      setIsListening(false);
      handleAsk(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const sampleQueries = [
    "What are customers complaining about most?",
    "Why are payment transactions failing?",
    "What do customers love about our mobile app?",
    "Explain 2FA and authentication best practices",
  ];

  return (
    <main className="text-white p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
          <Sparkles className="h-3.5 w-3.5" /> ASK LOOP INTELLIGENCE COPILOT
        </div>
        <h1 className="mt-2 text-3xl font-bold">Ask about your customer feedback</h1>
        <p className="mt-1 text-slate-400">
          Ask questions naturally via voice or text. Answers are grounded in real database citations with zero hallucinations.
        </p>
      </div>

      {/* Input Box */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="For example: What are customers complaining about most in checkout?"
          rows={3}
          className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950/80 p-4 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-500"
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => handleAsk()}
              disabled={isAsking || !question.trim()}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2 rounded-lg transition"
            >
              {isAsking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Synthesizing...
                </>
              ) : (
                "Ask LOOP AI"
              )}
            </Button>

            {sttSupported && (
              <Button
                type="button"
                onClick={handleToggleMic}
                variant="outline"
                className={`border-slate-700 text-slate-300 hover:bg-slate-800 ${
                  isListening ? "border-red-500 text-red-400 bg-red-950/30 animate-pulse" : ""
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="mr-2 h-4 w-4 text-red-400" /> Listening...
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-4 w-4 text-blue-400" /> Voice Query
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400">Try:</span>
            {sampleQueries.map((q) => (
              <button
                key={q}
                onClick={() => {
                  setQuestion(q);
                  handleAsk(q);
                }}
                className="text-xs rounded-full border border-slate-700 bg-slate-800/80 hover:bg-slate-700 px-3 py-1 text-slate-300 transition"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Answer Container */}
      {answer && (
        <div className="rounded-2xl border border-blue-900/60 bg-slate-900/80 p-6 backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                Grounded Executive Synthesis
              </h2>
            </div>

            {speechSupported && (
              <div className="flex items-center gap-3">
                {isPlayingAudio && (
                  <div className="flex items-center gap-1">
                    <span className="h-3 w-1 bg-cyan-400 rounded-full animate-bounce" />
                    <span className="h-4 w-1 bg-blue-400 rounded-full animate-bounce delay-75" />
                    <span className="h-2 w-1 bg-indigo-400 rounded-full animate-bounce delay-150" />
                  </div>
                )}
                <Button
                  onClick={handleToggleVoice}
                  size="sm"
                  variant="outline"
                  className="border-blue-500/40 text-blue-400 hover:bg-blue-950/40"
                >
                  {isPlayingAudio ? (
                    <>
                      <Square className="mr-2 h-3.5 w-3.5 fill-current" /> Stop Audio
                    </>
                  ) : (
                    <>
                      <Volume2 className="mr-2 h-3.5 w-3.5" /> Listen Audio Briefing
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4 text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
            {answer}
          </div>

          {/* Evidence Citations */}
          {evidence && evidence.length > 0 && (
            <div className="border-t border-slate-800 pt-6 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Quote className="h-3.5 w-3.5 text-blue-400" /> Grounded Evidence Citations ({evidence.length})
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {evidence.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-semibold text-blue-400">{item.source || "Customer"}</span>
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-emerald-400">
                        Match: {(item.similarity * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-slate-300 italic">"{item.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}