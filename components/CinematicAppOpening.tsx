"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, ArrowRight } from "lucide-react";

export default function CinematicAppOpening() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

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

  // Play video automatically without any play button
  useEffect(() => {
    if (!isOpen || !videoRef.current) return;

    const playVideo = async () => {
      if (!videoRef.current) return;
      try {
        videoRef.current.currentTime = 0;
        videoRef.current.muted = false;
        setIsMuted(false);
        await videoRef.current.play();
      } catch {
        // Fallback for browser autoplay policy: play automatically with audio un-muting on any first user interaction
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          try {
            await videoRef.current.play();
          } catch {}
        }
      }
    };

    playVideo();

    // Global listener: on first click anywhere on the page, unmute if muted
    const handleGlobalInteraction = () => {
      if (videoRef.current && videoRef.current.muted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    };

    window.addEventListener("click", handleGlobalInteraction, { once: true });
    window.addEventListener("keydown", handleGlobalInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleGlobalInteraction);
      window.removeEventListener("keydown", handleGlobalInteraction);
    };
  }, [isOpen]);

  const handleSkipOrComplete = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    try {
      sessionStorage.setItem("loop_cinematic_intro_seen", "true");
    } catch {}
    setIsOpen(false);
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 10;
    setProgress((cur / dur) * 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center select-none overflow-hidden animate-in fade-in duration-300">
      {/* Top Floating Minimal Controls */}
      <div className="absolute top-4 inset-x-4 sm:top-6 sm:inset-x-8 flex items-center justify-end gap-3 z-30 pointer-events-auto">
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
          onClick={handleSkipOrComplete}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold backdrop-blur-md active:scale-95 transition shadow-lg"
        >
          Skip <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Video Viewport - Plays Automatically without any Play Button */}
      <div className="relative w-full h-full flex items-center justify-center bg-black">
        <video
          ref={videoRef}
          src="/intro-video-cheri.mp4"
          autoPlay
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleSkipOrComplete}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Bottom Progress Line */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10 z-30">
        <div
          className="h-full bg-blue-500 transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
