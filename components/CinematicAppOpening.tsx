"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";

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

  // Automatic playback without any play button
  useEffect(() => {
    if (!isOpen) return;

    const playVideoAutomatically = async () => {
      if (!videoRef.current) return;
      try {
        videoRef.current.currentTime = 0;
        videoRef.current.muted = false;
        setIsMuted(false);
        await videoRef.current.play();
      } catch (err) {
        // If browser blocks unmuted autoplay, play muted automatically without any play button
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          try {
            await videoRef.current.play();
          } catch (e) {
            console.error("Autoplay prevented:", e);
          }
        }
      }
    };

    const timer = setTimeout(playVideoAutomatically, 50);
    return () => clearTimeout(timer);
  }, [isOpen]);

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
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 10;
    setProgress((cur / dur) * 100);
  };

  // Any click on the background unmutes audio if it started muted
  const handleContainerClick = () => {
    if (videoRef.current && videoRef.current.muted) {
      videoRef.current.muted = false;
      setIsMuted(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleContainerClick}
      className={`fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center select-none overflow-hidden transition-opacity duration-400 ease-out ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Top Floating Minimal Controls: Mute & Skip only */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8 flex items-center gap-3 z-30 pointer-events-auto">
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
          onClick={handleFinish}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold backdrop-blur-md active:scale-95 transition shadow-lg"
        >
          Skip <ArrowRight className="w-3.5 h-3.5" />
        </button>
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
      </div>

      {/* Bottom Progress Line */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10 z-30">
        <div
          className="h-full bg-blue-500 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
