import PlayIcon from "@/iconComponents/Play";
import { usePlayback } from "@/context/PlaybackContext";
import type { Song } from "../../public/data/songs";
import { useLikedSongs } from "../../hooks/useLikedSongs";

type AlbumRowProps = {
  index: number;
  song: Song;
  artistName: string;
  duration: string;
  playlist?: Song[];
};

export default function AlbumRow({
  index,
  song,
  artistName,
  duration,
  playlist,
}: AlbumRowProps) {
  const { playSong } = usePlayback();

  const handlePlay = () => {
    playSong(song, playlist ?? undefined);
  };

  const { isLiked , toggleLike } = useLikedSongs(song.id);
  

  return (
    <div className="group flex h-14 gap-4 items-center rounded hover:bg-neutral-700">
      <button
        type="button"
        onClick={handlePlay}
        className="h-10 w-10 flex items-center justify-center text-neutral-400 group-hover:text-white"
        aria-label={`Play ${song.title}`}
      >
        <span className="group-hover:hidden">{index}</span>
        {/* <span className="hidden group-hover:inline-flex">
          <PlayIcon />
        </span> */}
      </button>

      <div className="">
        <div className="font-bold">{song.title}</div>
        <div className="text-sm text-neutral-300">{artistName}</div>
      </div>
      <div className="flex-1" />
      <div className="flex items-center">
        {isLiked ? (
          <svg
            onClick={() => toggleLike(song?.id)}
            className="w-4 h-4 text-[#1db954] cursor-pointer fill-white"
            
            viewBox="0 0 16 16"
          >
            <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m11.748-1.97a.75.75 0 0 0-1.06-1.06l-4.47 4.47-1.405-1.406a.75.75 0 1 0-1.061 1.06l2.466 2.467 5.53-5.53z" />
          </svg>
        ) : (
          <svg
          onClick={() => toggleLike(song?.id)}
            className="w-4 h-4 text-neutral-400 fill-white cursor-pointer"
            viewBox="0 0 24 24"
          >
            <path d="M11.999 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18m-11 9c0-6.075 4.925-11 11-11s11 4.925 11 11-4.925 11-11 11-11-4.925-11-11" /> 
            <path d="M17.999 12a1 1 0 0 1-1 1h-4v4a1 1 0 1 1-2 0v-4h-4a1 1 0 1 1 0-2h4V7a1 1 0 1 1 2 0v4h4a1 1 0 0 1 1 1" />
          </svg>
        )}
      </div>
      <div className= "mr-8 text-neutral-300">{duration}</div>
    </div>
  );
}