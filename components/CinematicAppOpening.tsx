"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowRight, Volume2, VolumeX, Music } from "lucide-react";

export default function CinematicAppOpening() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Check if intro has already been shown in this session
  useEffect(() => {
    try {
      const alreadySeen = sessionStorage.getItem("loop_cinematic_intro_seen");
      if (!alreadySeen) {
        setIsOpen(true);
      }
    } catch {
      setIsOpen(true);
    }
  }, []);

  const unmuteAudio = useCallback(() => {
    if (videoRef.current) {
      try {
        videoRef.current.muted = false;
        videoRef.current.volume = 1.0;
        setIsMuted(false);
      } catch (e) {
        console.warn("Unmute failed:", e);
      }
    }
  }, []);

  // Automatic unmuted playback & global listener for immediate audio activation
  useEffect(() => {
    if (!isOpen) return;

    // 1. Initialize Web Audio Context if available
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        if (ctx.state === "suspended") {
          ctx.resume().catch(() => {});
        }
      }
    } catch {}

    // 2. Play video automatically with full audio
    const playVideoWithAudio = async () => {
      const video = videoRef.current;
      if (!video) return;

      try {
        video.currentTime = 0;
        video.muted = false;
        video.volume = 1.0;
        await video.play();
        setIsMuted(false);
      } catch {
        // If the browser strictly enforces muted initial autoplay:
        // Play video immediately, and attach listeners to activate audio on the very first signal
        if (video) {
          video.muted = true;
          setIsMuted(true);
          try {
            await video.play();
          } catch (e) {
            console.error("Autoplay playback error:", e);
          }
        }
      }
    };

    const timer = setTimeout(playVideoWithAudio, 20);

    // Any window event immediately un-mutes the song without needing any button
    const handleGlobalSignal = () => {
      unmuteAudio();
    };

    window.addEventListener("pointerdown", handleGlobalSignal, { passive: true });
    window.addEventListener("touchstart", handleGlobalSignal, { passive: true });
    window.addEventListener("click", handleGlobalSignal, { passive: true });
    window.addEventListener("keydown", handleGlobalSignal, { passive: true });
    window.addEventListener("wheel", handleGlobalSignal, { passive: true });
    window.addEventListener("focus", handleGlobalSignal, { passive: true });
    document.addEventListener("visibilitychange", handleGlobalSignal, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("pointerdown", handleGlobalSignal);
      window.removeEventListener("touchstart", handleGlobalSignal);
      window.removeEventListener("click", handleGlobalSignal);
      window.removeEventListener("keydown", handleGlobalSignal);
      window.removeEventListener("wheel", handleGlobalSignal);
      window.removeEventListener("focus", handleGlobalSignal);
      document.removeEventListener("visibilitychange", handleGlobalSignal);
    };
  }, [isOpen, unmuteAudio]);

  const handleFinish = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      try {
        sessionStorage.setItem("loop_cinematic_intro_seen", "true");
      } catch {}
      setIsOpen(false);
    }, 400); // Quick smooth 400ms transition to open the app
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isMuted) {
      unmuteAudio();
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
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
    <div
      onClick={unmuteAudio}
      className={`fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center select-none overflow-hidden transition-opacity duration-400 ease-out cursor-pointer ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Top Floating Minimal Controls: Audio State & Skip only */}
      <div className="absolute top-4 inset-x-4 sm:top-6 sm:inset-x-8 flex items-center justify-between z-30 pointer-events-auto">
        {/* Subtle Audio Status Indicator */}
        <div
          onClick={unmuteAudio}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/20 text-white text-xs backdrop-blur-md transition hover:bg-black/80"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-rose-400 animate-pulse" />
              <span className="text-[11px] text-rose-300 font-medium hidden sm:inline">
                Tap anywhere to unmute song
              </span>
            </>
          ) : (
            <>
              <Music className="w-3.5 h-3.5 text-blue-400 animate-bounce" />
              <span className="text-[11px] text-blue-300 font-medium hidden sm:inline">
                Cheri Cheri Lady Playing
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleMute}
            className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white transition backdrop-blur-md"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleFinish();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold backdrop-blur-md active:scale-95 transition shadow-lg"
          >
            Skip <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Fullscreen Video - Auto-plays directly with Cheri Cheri Lady audio */}
      <div className="relative w-full h-full flex items-center justify-center bg-black">
        <video
          ref={videoRef}
          src="/intro-video-cheri.mp4"
          autoPlay
          playsInline
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleFinish}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Bottom Progress Line */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10 z-30 pointer-events-none">
        <div
          className="h-full bg-blue-500 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
