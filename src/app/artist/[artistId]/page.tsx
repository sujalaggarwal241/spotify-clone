"use client";

import { useParams } from "next/navigation";
import { songs } from "../../../../public/data/songs";
import { artists } from "../../../../public/data/artists";
import ArtistSongRow from "@/components/ArtistSongRow";
export default function Artist() {
  const params = useParams();
  const artistId = params.artistId;

  const artist = artists.filter(
    (artist) => artist.id === Number(artistId)
  )[0];
  console.log("Artist ID:", artistId);


  const allSongs = songs.filter(
    (song) => song.artistId === Number(artistId)
  );

  allSongs.sort((a,b) => b.streams - a.streams);

  const backgroundImage = `/artistImages/${artistId}.jpg`;

  return (
    <div className="flex flex-col min-h-screen rounded-xl">
      {/* Header / Navbar space is fixed, so main starts after it */}
      <main className="flex-1 flex flex-col overflow-auto">
        {/* Artist banner */}
        <div
          className="h-96 w-full flex items-end justify-start bg-cover bg-center p-6 relative"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="flex flex-col gap-4 text-white drop-shadow-lg">
            <div className="text-6xl font-black">{artist.name}</div>
            <div className="">{artist.monthlyListeners} monthly listeners</div>
          </div>
        </div>

        {/* Rest of the page */}
        <div className="flex-1 p-4">
          <div className="text-2xl font-bold py-4">Popular</div>

          {allSongs.map((song, index)=>(
            <ArtistSongRow 
            index={index+1}
            songTitle={song.title} 
            streams={song.streams} 
            duration={`${Math.floor(song.duration/60)}:${Math.floor(song.duration%60)}`} />
          ))} 
          
        </div>
        <div className="flex-1 p-4">
          <p>More content goes here...</p>
        </div>
      </main>

      
    </div>
  );
}
