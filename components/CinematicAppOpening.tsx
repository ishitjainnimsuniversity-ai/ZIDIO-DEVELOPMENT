"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowRight, Volume2, VolumeX, Music, Play } from "lucide-react";

export default function CinematicAppOpening() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);
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

  const startPlaybackWithSound = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      video.currentTime = 0;
      video.muted = false;
      video.volume = 1.0;
      await video.play();
      setIsMuted(false);
      setIsPlaying(true);
      setNeedsGesture(false);
    } catch {
      // Browser blocked unmuted autoplay: start video muted and listen for any touch/click/key
      video.muted = true;
      setIsMuted(true);
      try {
        await video.play();
        setIsPlaying(true);
        setNeedsGesture(true);
      } catch (e) {
        console.error("Autoplay completely prevented:", e);
      }
    }
  }, []);

  const unmuteAndRestartAudio = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    video.volume = 1.0;
    setIsMuted(false);
    setNeedsGesture(false);

    // If it started muted and user clicked within the first 2 seconds, restart from beginning so they don't miss the song
    if (video.currentTime < 2.5) {
      video.currentTime = 0;
    }
    video.play().catch(() => {});
  }, []);

  // Try automatic unmuted playback immediately when opened
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      startPlaybackWithSound();
    }, 50);

    // Any interaction anywhere on the screen instantly un-mutes the song
    const handleGlobalSignal = () => {
      unmuteAndRestartAudio();
    };

    window.addEventListener("pointerdown", handleGlobalSignal, { passive: true });
    window.addEventListener("touchstart", handleGlobalSignal, { passive: true });
    window.addEventListener("click", handleGlobalSignal, { passive: true });
    window.addEventListener("keydown", handleGlobalSignal, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("pointerdown", handleGlobalSignal);
      window.removeEventListener("touchstart", handleGlobalSignal);
      window.removeEventListener("click", handleGlobalSignal);
      window.removeEventListener("keydown", handleGlobalSignal);
    };
  }, [isOpen, startPlaybackWithSound, unmuteAndRestartAudio]);

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
    }, 400); // Quick smooth transition to open the app
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isMuted) {
      unmuteAndRestartAudio();
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
      onClick={unmuteAndRestartAudio}
      className={`fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center select-none overflow-hidden transition-opacity duration-400 ease-out cursor-pointer ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Top Floating Minimal Controls: Audio State & Skip only */}
      <div className="absolute top-4 inset-x-4 sm:top-6 sm:inset-x-8 flex items-center justify-between z-30 pointer-events-auto">
        <div className="flex items-center gap-2">
          {!isMuted && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/20 text-white text-xs backdrop-blur-md">
              <Music className="w-3.5 h-3.5 text-blue-400 animate-bounce" />
              <span className="text-[11px] text-blue-300 font-medium">
                Cheri Cheri Lady Playing
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

        {/* Subtle glowing prompt if browser strictly blocked unmuted initial sound */}
        {needsGesture && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="px-5 py-3 rounded-2xl bg-black/70 border border-white/20 backdrop-blur-md shadow-2xl flex items-center gap-3 animate-pulse">
              <Volume2 className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-semibold text-white">
                Tap anywhere to start music
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
