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
import { useLikedSongs } from "../../hooks/useLikedSongs";

export default function Player() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isCurrentSongLiked, setIsCurrentSongLiked] = useState(false);


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

  const { isLiked, toggleLike } = useLikedSongs(currentSong?.id);

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
        loop={loop}
      />

      <div className="fixed bottom-0 left-0 w-full h-20 px-6 flex items-center bg-black z-50">
        {/* LEFT */}
        <div className="flex gap-4 min-w-[280px]">
          {/* IMAGE + TEXT */}
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded bg-cover bg-center"
              style={{ backgroundImage: `url(${currentSong.coverUrl})` }}
            />

            <div className="flex flex-col overflow-hidden">
              <div className="font-bold text-sm truncate">
                {currentSong.title}
              </div>
              <div className="text-xs text-neutral-400 truncate">
                {currentSong.artist}
              </div>
            </div>
          </div>

          {/* LIKE BUTTON */}
          <div className="flex items-center">
            {isLiked ? (
              <svg
                onClick={() => toggleLike(currentSong?.id)}
                className="w-4 h-4 text-[#1db954] cursor-pointer fill-white"
                
                viewBox="0 0 16 16"
              >
                <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m11.748-1.97a.75.75 0 0 0-1.06-1.06l-4.47 4.47-1.405-1.406a.75.75 0 1 0-1.061 1.06l2.466 2.467 5.53-5.53z" />
              </svg>
            ) : (
              <svg
              onClick={() => toggleLike(currentSong?.id)}
                className="w-4 h-4 text-neutral-400 fill-white cursor-pointer"
                viewBox="0 0 24 24"
              >
                <path d="M11.999 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18m-11 9c0-6.075 4.925-11 11-11s11 4.925 11 11-4.925 11-11 11-11-4.925-11-11" /> 
                <path d="M17.999 12a1 1 0 0 1-1 1h-4v4a1 1 0 1 1-2 0v-4h-4a1 1 0 1 1 0-2h4V7a1 1 0 1 1 2 0v4h4a1 1 0 0 1 1 1" />
              </svg>
            )}
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
