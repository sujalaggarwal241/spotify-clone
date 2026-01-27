import PlayIcon from "@/iconComponents/Play";
import { usePlayback } from "@/context/PlaybackContext";
import type { Song } from "../../public/data/songs";

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
      <div className="mr-8 text-neutral-300">{duration}</div>
    </div>
  );
}