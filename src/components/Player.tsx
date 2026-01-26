"use client";

import { useRef, useEffect, useState } from "react";
import { usePlayback } from "@/context/PlaybackContext";

import IconButton from "./IconButton";
import ShuffleIcon from "@/iconComponents/Shuffle";
import PreviousIcon from "@/iconComponents/Previous";
import PauseIcon from "@/iconComponents/Pause";
import PlayIcon from "@/iconComponents/Play";
import NextIcon from "@/iconComponents/Next";
import LoopIcon from "@/iconComponents/Loop";
import MicIcon from "@/iconComponents/Mic";
import QueueIcon from "@/iconComponents/Queue";
import DeviceIcon from "@/iconComponents/Device";
import SpeakerIcon from "@/iconComponents/Speaker";
import MiniScreenIcon from "@/iconComponents/MiniScreen";
import FullScreenIcon from "@/iconComponents/FullScreen";

export default function Player() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  const {
    currentSong,
    isPlaying,
    togglePlay,
    next,
    prev,
    shuffle,
    loop,
    toggleShuffle,
    toggleLoop,
  } = usePlayback();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  /* ---------- AUDIO SYNC ---------- */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (isPlaying) audio.play();
    else audio.pause();
  }, [isPlaying, currentSong]);

  /* ---------- AUDIO EVENTS ---------- */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration);
    const onEnd = () => next();

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnd);
    };
  }, [next]);

  /* ---------- SEEK ---------- */
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = percent * duration;
  };

  /* ---------- FORMAT TIME ---------- */
  const formatTime = (time: number) => {
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!currentSong) return null;

  return (
    <>
      {/* AUDIO */}
      <audio
        ref={audioRef}
        src={currentSong.audioUrl}
        preload="metadata"
      />

      <div className="fixed bottom-0 left-0 w-full h-20 px-6 flex items-center bg-black z-50">
        {/* LEFT */}
        <div className="flex gap-4 min-w-[280px]">
          <div
            className="w-14 h-14 rounded bg-cover bg-center"
            style={{ backgroundImage: `url(${currentSong.coverUrl})` }}
          />

          <div className="flex flex-col justify-center overflow-hidden">
            <div className="font-bold text-sm truncate">
              {currentSong.title}
            </div>
            <div className="text-xs text-neutral-400 truncate">
              {currentSong.artist}
            </div>
          </div>
        </div>

        {/* CENTER */}
        <div className="flex flex-col flex-1 gap-2 items-center">
          {/* CONTROLS */}
          <div className="flex items-center gap-2">
            <IconButton
              label="Shuffle"
              onClick={toggleShuffle}
            >
              <ShuffleIcon />
            </IconButton>

            <IconButton label="Previous" onClick={prev}>
              <PreviousIcon />
            </IconButton>

            <IconButton
              label={isPlaying ? "Pause" : "Play"}
              onClick={togglePlay}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </IconButton>

            <IconButton label="Next" onClick={next}>
              <NextIcon />
            </IconButton>

            <IconButton
              label="Loop"
              onClick={toggleLoop}
            >
              <LoopIcon />
            </IconButton>
          </div>

          {/* PROGRESS */}
          <div className="flex items-center gap-2 w-full max-w-xl">
            <span className="text-xs text-neutral-400">
              {formatTime(currentTime)}
            </span>

            <div
              ref={progressRef}
              onClick={handleSeek}
              className="flex-1 h-1 bg-neutral-600 rounded-full cursor-pointer overflow-hidden"
            >
              <div
                className="h-full bg-white"
                style={{
                  width:
                    duration > 0
                      ? `${(currentTime / duration) * 100}%`
                      : "0%",
                }}
              />
            </div>

            <span className="text-xs text-neutral-400">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex gap-1 items-center min-w-[240px] justify-end">
          <IconButton label="Lyrics"><MicIcon /></IconButton>
          <IconButton label="Queue"><QueueIcon /></IconButton>
          <IconButton label="Devices"><DeviceIcon /></IconButton>
          <IconButton label="Volume"><SpeakerIcon /></IconButton>

          <div className="w-16 h-1 bg-neutral-600 rounded-full" />

          <IconButton label="Mini Player"><MiniScreenIcon /></IconButton>
          <IconButton label="Full Screen"><FullScreenIcon /></IconButton>
        </div>
      </div>
    </>
  );
}
