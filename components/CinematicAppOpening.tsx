"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, ArrowRight, Play } from "lucide-react";

interface CinematicAppOpeningProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export default function CinematicAppOpening({
  forceOpen = false,
  onClose,
}: CinematicAppOpeningProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [needsSoundTap, setNeedsSoundTap] = useState(false);
  const [progress, setProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Check if intro has already been shown in this session
  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
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

  // Attempt direct playback with audio immediately when opened
  useEffect(() => {
    if (!isOpen) return;

    const playDirectly = async () => {
      if (!videoRef.current) return;
      try {
        videoRef.current.currentTime = 0;
        videoRef.current.muted = false;
        setIsMuted(false);
        await videoRef.current.play();
        setNeedsSoundTap(false);
      } catch (err) {
        // Modern browser policy blocked unmuted autoplay: start muted and offer 1-click sound unmute
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          try {
            await videoRef.current.play();
            setNeedsSoundTap(true);
          } catch {
            setNeedsSoundTap(true);
          }
        }
      }
    };

    const timer = setTimeout(playDirectly, 100);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleUnmuteOrStart = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = false;
    setIsMuted(false);
    videoRef.current.play();
    setNeedsSoundTap(false);
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
    setNeedsSoundTap(false);
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
      onClick={needsSoundTap ? handleUnmuteOrStart : undefined}
      className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center select-none overflow-hidden animate-in fade-in duration-300"
    >
      {/* Top Floating Controls: Minimal Mute & Skip only */}
      <div className="absolute top-4 inset-x-4 sm:top-6 sm:inset-x-8 flex items-center justify-end gap-3 z-30 pointer-events-auto">
        {/* Mute / Unmute Toggle */}
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

        {/* Skip to App */}
        <button
          type="button"
          onClick={handleSkipOrComplete}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold backdrop-blur-md active:scale-95 transition shadow-lg"
        >
          Skip <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Video Viewport - Plays Directly with Cheri Cheri Lady */}
      <div className="relative w-full h-full flex items-center justify-center bg-black">
        <video
          ref={videoRef}
          src="/intro-video-cheri.mp4"
          preload="auto"
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleSkipOrComplete}
          className="w-full h-full object-cover"
        />

        {/* Browser Autoplay Prompt: 1-click anywhere or on the button to enable sound */}
        {needsSoundTap && (
          <div
            onClick={handleUnmuteOrStart}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer transition-all z-20"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-2xl shadow-blue-500/50 hover:scale-110 active:scale-95 transition-transform flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-slate-950/90 flex items-center justify-center">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </div>
            </div>
            <p className="mt-4 text-sm font-semibold text-white tracking-wide">
              Click anywhere for sound
            </p>
          </div>
        )}
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
