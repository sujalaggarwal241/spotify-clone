"use client";

import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import { songs } from "../../public/data/songs";

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

type PlayerProps = {
  songId?: number;
};

export default function Player({ songId = 2 }: PlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const song = useMemo(
    () => songs.find((s) => s.id === songId) ?? songs[0],
    [songId]
  );

  /* ---------- PLAY / PAUSE ---------- */
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  /* ---------- FORMAT TIME ---------- */
  const formatTime = (time: number) => {
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  /* ---------- SEEK ---------- */
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = percent * duration;
  };

  /* ---------- AUDIO EVENTS ---------- */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration);
    const onEnd = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  /* ---------- RESET ON SONG CHANGE ---------- */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  }, [songId]);

  return (
    <>
      {/* AUDIO */}
      <audio ref={audioRef} src={song.audioUrl} preload="metadata" />

      <div className="fixed bottom-0 left-0 w-full h-20 px-6 flex items-center bg-black z-50">
        {/* LEFT */}
        <div className="flex gap-4 min-w-[280px]">
          <div
            className="w-14 h-14 rounded bg-cover bg-center"
            style={{ backgroundImage: `url(${song.coverUrl})` }}
          />

          <div className="flex flex-col justify-center overflow-hidden">
            <div className="font-bold text-sm whitespace-nowrap overflow-hidden">
              <span>{song.title}</span>
            </div>
            <div className="text-xs text-neutral-400 whitespace-nowrap overflow-hidden">
              <span>{song.artist}</span>
            </div>
          </div>
        </div>

        {/* CENTER */}
        <div className="flex flex-col flex-1 gap-2 items-center">
          {/* CONTROLS */}
          <div className="flex items-center gap-2">
            <IconButton label="Shuffle"><ShuffleIcon /></IconButton>
            <IconButton label="Previous"><PreviousIcon /></IconButton>

            <IconButton
              label={isPlaying ? "Pause" : "Play"}
              onClick={togglePlay}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </IconButton>

            <IconButton label="Next"><NextIcon /></IconButton>
            <IconButton label="Loop"><LoopIcon /></IconButton>
          </div>

          {/* PROGRESS */}
          <div className="flex items-center gap-2 w-full max-w-xl">
            <span className="text-xs text-neutral-400">
              {formatTime(currentTime)}
            </span>

            <div
              ref={progressRef}
              onClick={handleProgressClick}
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
