"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  Sparkles,
  Music,
  Radio
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CinematicIntroPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTrack, setActiveTrack] = useState<"stereo" | "cheri">("stereo");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(10);
  const [showOverlay, setShowOverlay] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentVideoSrc =
    activeTrack === "stereo" ? "/intro-video.mp4" : "/intro-video-cheri.mp4";

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowOverlay(true);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        setShowOverlay(false);
      }).catch(() => {
        // Autoplay policy fallback: mute and play
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play();
          setIsPlaying(true);
          setShowOverlay(false);
        }
      });
    }
  };

  const handleToggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSwitchTrack = (track: "stereo" | "cheri") => {
    if (track === activeTrack) return;
    setActiveTrack(track);
    setIsPlaying(false);
    setShowOverlay(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  const handleRestart = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
    setShowOverlay(false);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || 10);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setShowOverlay(true);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-950 p-2 sm:p-4 shadow-2xl overflow-hidden group shadow-blue-950/30"
    >
      {/* 4K Cinematic Ambient Glow Background */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition duration-1000 -z-10" />

      {/* Top Media Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-3 py-2 border-b border-slate-800/80 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Official Introduction Video
          </span>
          <Badge variant="outline" className="text-[10px] border-blue-500/40 bg-blue-500/10 text-blue-300 font-mono">
            4K UHD MASTER
          </Badge>
        </div>

        {/* English Soundtrack Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-lg text-xs">
          <Music className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
          <span className="text-[11px] text-slate-400 font-medium mr-1">Soundtrack:</span>
          <button
            type="button"
            onClick={() => handleSwitchTrack("stereo")}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
              activeTrack === "stereo"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Stereo Love
          </button>
          <button
            type="button"
            onClick={() => handleSwitchTrack("cheri")}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
              activeTrack === "cheri"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Cheri Cheri Lady
          </button>
        </div>
      </div>

      {/* Video Viewport Container */}
      <div className="relative aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          key={currentVideoSrc}
          src={currentVideoSrc}
          preload="metadata"
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onClick={handleTogglePlay}
          className="w-full h-full object-contain cursor-pointer"
        />

        {/* Play Overlay Screen when paused or ended */}
        {showOverlay && (
          <div
            onClick={handleTogglePlay}
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer transition-opacity group-hover:bg-black/40"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-2xl shadow-blue-500/50 hover:scale-110 active:scale-95 transition-transform flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-slate-950/80 flex items-center justify-center">
                <Play className="w-7 h-7 sm:w-9 sm:h-9 text-white fill-white ml-1" />
              </div>
            </div>
            <p className="mt-4 text-xs sm:text-sm font-semibold text-white tracking-wide">
              Click to Play 4K Introduction Video
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Soundtrack: {activeTrack === "stereo" ? "Stereo Love" : "Cheri Cheri Lady"}
            </p>
          </div>
        )}

        {/* Video Control Bar at Bottom */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 sm:p-4 flex flex-col gap-2 opacity-90 transition-opacity">
          {/* Progress Bar */}
          <div
            className="w-full h-1.5 bg-slate-800/80 rounded-full cursor-pointer overflow-hidden relative"
            onClick={(e) => {
              if (!videoRef.current) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = (e.clientX - rect.left) / rect.width;
              videoRef.current.currentTime = pos * duration;
            }}
          >
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="text-slate-300 hover:text-white transition"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="text-slate-300 hover:text-white transition"
                title="Restart Video"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleToggleMute}
                className="text-slate-300 hover:text-white transition flex items-center gap-1"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                )}
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  {isMuted ? "Muted" : "Stereo Sound"}
                </span>
              </button>

              <span className="text-[11px] font-mono text-slate-400">
                0:0{Math.floor(currentTime)} / 0:10
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
                2160p 4K UHD • 60 FPS
              </span>
              <button
                type="button"
                onClick={handleFullscreen}
                className="text-slate-300 hover:text-white transition"
                title="Full Screen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Subtitle & Authors Footer */}
      <div className="mt-3 px-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-slate-400">
        <p className="flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-blue-400" />
          <span>Cinematic Platform Entry — Created by <strong>Ishit Jain</strong> & <strong>Mitali</strong></span>
        </p>
        <p className="text-[11px] text-slate-500 font-mono">
          Audio: {activeTrack === "stereo" ? "Edward Maya (Stereo Love)" : "Modern Talking (Cheri Cheri Lady)"}
        </p>
      </div>
    </div>
  );
}
