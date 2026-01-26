import Image from "next/image"
import type { Song } from "../../public/data/songs"
import { artists } from "../../public/data/artists"

export default function Card({ song }: { song: Song }) {

  const artistName = artists.filter(
    (artist) => (song.artistId === artist.id)
  );

    return (
      <div className="flex flex-col shrink-0 gap-1 hover:bg-neutral-600 p-2 rounded">
        <div className="w-[190px] h-[106px] overflow-hidden rounded"> 
        <img  
          src={song.coverUrl}
          alt="coverimage"
          width={190}
          height={100}
          className="rounded object-cover"
        />
        </div>
        
        <div className="text-xl font-bold -mb-1">{song.title}</div>
        <div> {artistName[0].name} </div>
      </div>
    )
  }