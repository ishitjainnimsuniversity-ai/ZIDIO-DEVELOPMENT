"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  Music,
  RotateCcw,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CinematicAppOpeningProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export default function CinematicAppOpening({
  forceOpen = false,
  onClose,
}: CinematicAppOpeningProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTrack, setActiveTrack] = useState<"stereo" | "cheri">("stereo");
  const [progress, setProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);

  const currentVideoSrc =
    activeTrack === "stereo" ? "/intro-video.mp4" : "/intro-video-cheri.mp4";

  // Check if intro has already been shown in this session
  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      setHasStarted(false);
      return;
    }

    try {
      const alreadySeen = sessionStorage.getItem("loop_cinematic_intro_seen");
      if (!alreadySeen) {
        setIsOpen(true);
      }
    } catch {
      setIsOpen(true);
    }
  }, [forceOpen]);

  const handleStartIntro = () => {
    setHasStarted(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = isMuted;
      videoRef.current.play().catch(() => {
        // Fallback for strict browser autoplay: mute and play
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play();
        }
      });
    }
  };

  const handleSkipOrComplete = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    try {
      sessionStorage.setItem("loop_cinematic_intro_seen", "true");
    } catch {}
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSwitchTrack = (track: "stereo" | "cheri", e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTrack(track);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (hasStarted) {
        videoRef.current.play();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 10;
    setProgress((cur / dur) * 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center select-none overflow-hidden animate-in fade-in duration-500">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-radial from-blue-900/20 via-black to-black pointer-events-none" />

      {/* Top Bar Floating Controls */}
      <div className="absolute top-4 inset-x-4 sm:top-6 sm:inset-x-8 flex items-center justify-between z-30 pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
          <span className="text-xs font-bold text-white tracking-wider uppercase font-mono">
            LOOP CINEMATIC OPENING (4K)
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Audio Switcher */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-900/80 border border-slate-800 p-1 rounded-full text-xs backdrop-blur-md">
            <Music className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1" />
            <button
              type="button"
              onClick={(e) => handleSwitchTrack("stereo", e)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition ${
                activeTrack === "stereo"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Stereo Love
            </button>
            <button
              type="button"
              onClick={(e) => handleSwitchTrack("cheri", e)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition ${
                activeTrack === "cheri"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Cheri Cheri Lady
            </button>
          </div>

          {/* Mute Toggle */}
          {hasStarted && (
            <button
              type="button"
              onClick={handleToggleMute}
              className="p-2.5 rounded-full bg-slate-900/80 border border-slate-800 text-white hover:bg-slate-800 transition backdrop-blur-md"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              )}
            </button>
          )}

          {/* Skip Intro Button */}
          <button
            type="button"
            onClick={handleSkipOrComplete}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold backdrop-blur-md active:scale-95 transition shadow-lg"
          >
            Skip to App <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Fullscreen Video Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        <video
          ref={videoRef}
          key={currentVideoSrc}
          src={currentVideoSrc}
          preload="auto"
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleSkipOrComplete}
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            hasStarted ? "opacity-100" : "opacity-30 blur-sm"
          }`}
        />

        {/* Initial Launch Screen Before User Starts Audio/Video */}
        {!hasStarted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 bg-black/60 backdrop-blur-md">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs font-semibold text-blue-400 mb-6 shadow-inner">
              <Sparkles className="w-4 h-4 text-blue-400" />
              The Project of Ishit Jain & Mitali
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight max-w-2xl">
              Welcome to <span className="text-blue-500">LOOP.</span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-md leading-relaxed">
              Experience the cinematic 4K platform entry with your choice of soundtrack before entering.
            </p>

            {/* Soundtrack Selector */}
            <div className="mt-6 flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={(e) => handleSwitchTrack("stereo", e)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTrack === "stereo"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                🎵 Stereo Love (Edward Maya)
              </button>
              <button
                type="button"
                onClick={(e) => handleSwitchTrack("cheri", e)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTrack === "cheri"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                🎵 Cheri Cheri Lady (Modern Talking)
              </button>
            </div>

            {/* Launch Button */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleStartIntro}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm sm:text-base shadow-2xl shadow-blue-600/50 hover:scale-105 active:scale-95 transition"
              >
                <Play className="w-5 h-5 fill-white" />
                Play 4K Intro with Music
              </button>

              <button
                type="button"
                onClick={handleSkipOrComplete}
                className="px-6 py-4 rounded-2xl border border-slate-700 bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 text-sm font-semibold transition"
              >
                Directly Enter App ➔
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Progress Line */}
      {hasStarted && (
        <div className="absolute bottom-0 inset-x-0 h-1.5 bg-slate-900 z-30">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Bottom Branding Caption */}
      <div className="absolute bottom-4 inset-x-4 sm:bottom-6 sm:inset-x-8 flex items-center justify-between z-20 pointer-events-none text-[11px] text-slate-400">
        <span>LOOP Enterprise AI • Customer Feedback Intelligence</span>
        <span className="font-mono">Created by Ishit Jain & Mitali</span>
      </div>
    </div>
  );
}
