"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowRight, Volume2, VolumeX, Music } from "lucide-react";

export default function CinematicAppOpening() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Unmute and ensure audio is at full volume
  const activateSound = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    try {
      video.muted = false;
      video.volume = 1.0;
      setIsMuted(false);
      setHasUserInteracted(true);

      // If user activated sound early, ensure they hear from 0:00
      if (video.currentTime < 2.0) {
        video.currentTime = 0;
      }
      video.play().catch(() => {});
    } catch (e) {
      console.warn("Audio activation error:", e);
    }
  }, []);

  // Automatic playback attempt on mount
  useEffect(() => {
    if (!isOpen) return;

    const video = videoRef.current;
    if (!video) return;

    // 1. Try playing with full sound first
    video.currentTime = 0;
    video.muted = false;
    video.volume = 1.0;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Unmuted autoplay succeeded!
          setIsMuted(false);
          setHasUserInteracted(true);
        })
        .catch(() => {
          // Browser autoplay policy blocked unmuted sound on cold load:
          // Play video immediately in muted mode, and listen for the very first interaction to instantly unmute
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().catch(() => {});
          }
        });
    }

    // 2. Listen to ANY user event anywhere on window to immediately turn on sound
    const handleImmediateGesture = () => {
      activateSound();
    };

    window.addEventListener("pointerdown", handleImmediateGesture, { passive: true });
    window.addEventListener("touchstart", handleImmediateGesture, { passive: true });
    window.addEventListener("click", handleImmediateGesture, { passive: true });
    window.addEventListener("keydown", handleImmediateGesture, { passive: true });
    window.addEventListener("wheel", handleImmediateGesture, { passive: true });
    window.addEventListener("focus", handleImmediateGesture, { passive: true });
    document.addEventListener("visibilitychange", handleImmediateGesture, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", handleImmediateGesture);
      window.removeEventListener("touchstart", handleImmediateGesture);
      window.removeEventListener("click", handleImmediateGesture);
      window.removeEventListener("keydown", handleImmediateGesture);
      window.removeEventListener("wheel", handleImmediateGesture);
      window.removeEventListener("focus", handleImmediateGesture);
      document.removeEventListener("visibilitychange", handleImmediateGesture);
    };
  }, [isOpen, activateSound]);

  const handleFinish = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setIsOpen(false);
    }, 400); // Quick smooth 400ms transition to open the app
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isMuted) {
      activateSound();
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
      onClick={activateSound}
      className={`fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center select-none overflow-hidden transition-opacity duration-400 ease-out cursor-pointer ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Top Floating Controls: Audio Status & Skip */}
      <div className="absolute top-4 inset-x-4 sm:top-6 sm:inset-x-8 flex items-center justify-between z-30 pointer-events-auto">
        <div className="flex items-center gap-2">
          {!isMuted ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/20 text-white text-xs backdrop-blur-md">
              <Music className="w-3.5 h-3.5 text-blue-400 animate-bounce" />
              <span className="text-[11px] text-blue-300 font-medium">
                Cheri Cheri Lady Playing
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/20 text-white text-xs backdrop-blur-md">
              <VolumeX className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span className="text-[11px] text-slate-300 font-medium">
                Tap screen for music
              </span>
            </div>
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

      {/* Main Fullscreen Video - Auto-plays directly with Cheri Cheri Lady */}
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

        {/* Subtle non-blocking center hint only when initially muted */}
        {isMuted && !hasUserInteracted && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="px-6 py-3.5 rounded-2xl bg-black/75 border border-white/20 backdrop-blur-md shadow-2xl flex items-center gap-3 animate-pulse">
              <Volume2 className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-semibold text-white tracking-wide">
                Tap anywhere for sound
              </span>
            </div>
          </div>
        )}
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
