"use client";

import { useParams } from "next/navigation";
import { songs } from "../../../../public/data/songs";
import { artists } from "../../../../public/data/artists";
import ArtistSongRow from "@/components/ArtistSongRow";
import PlayIcon from "@/iconComponents/Play";
import ShuffleIcon from "@/iconComponents/Shuffle";
import { usePlayback } from "@/context/PlaybackContext";
export default function Artist() {
  const params = useParams();
  const artistId = params.artistId;

  const artist = artists.filter(
    (artist) => artist.id === Number(artistId)
  )[0];

  const allSongs = songs.filter(
    (song) => song.artistId === Number(artistId)
  );

  const { playSong } = usePlayback();
  const handlePlay = () => {
    playSong(allSongs[0], allSongs);
  }


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

        <div className="flex h-18 w-full gap-4 items-center">
					<div
						onClick={handlePlay}
					  className="h-14 w-14 bg-green-500 rounded-full flex justify-center items-center"
					>
						<PlayIcon />
					</div>
					<div className="h-14 w-14 flex justify-center items-center text-4xl hover:bg-neutral-800 rounded-full">
						<ShuffleIcon />
					</div>
					<div>
						{/* // add to liked button  */}
						<svg
							viewBox="0 0 24 24"
							aria-hidden="true"
							className="w-10 h-10 fill-current text-neutral-400 hover:fill-white"
						>
							<path d="M11.999 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18m-11 9c0-6.075 4.925-11 11-11s11 4.925 11 11-4.925 11-11 11-11-4.925-11-11" />
							<path d="M17.999 12a1 1 0 0 1-1 1h-4v4a1 1 0 1 1-2 0v-4h-4a1 1 0 1 1 0-2h4V7a1 1 0 1 1 2 0v4h4a1 1 0 0 1 1 1" />
						</svg>
					</div>

					<div>
						{/* download button  */}
						<svg
							viewBox="0 0 24 24"
							aria-hidden="true"
							className="w-10 h-10 fill-current text-neutral-400 hover:fill-white"
						>
							<path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12" />
							<path d="M12 6.05a1 1 0 0 1 1 1v7.486l1.793-1.793a1 1 0 1 1 1.414 1.414L12 18.364l-4.207-4.207a1 1 0 1 1 1.414-1.414L11 14.536V7.05a1 1 0 0 1 1-1" />
						</svg>

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
          <p>To be handled</p>
        </div>
      </main>

      
    </div>
  );
}
