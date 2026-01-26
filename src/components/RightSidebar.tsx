"use client";

import Image from "next/image"
import Card from "./Card"
import { songs } from "../../public/data/songs";
import { artists } from "../../public/data/artists";
import { usePlayback } from "@/context/PlaybackContext";
import { useState } from "react";

export default function RightSidebar() {

  const { currentSong } = usePlayback();
  const [currentArtistId, setCurrentArtist] = useState(currentSong.artistId || 'Kanye west')

  const artistDetails = artists.filter(
    (artist) => artist.id === currentArtistId
  )[0]
  if (!currentSong) return null;

  const recommendedTracks = songs.filter(
    (song) =>
      song.artistId=== currentSong.artistId &&
      song.id !== currentSong.id
  );

  console.log(recommendedTracks);
  return (
    <aside className="w-82 h-full overflow-auto overscroll-contain rounded-xl">
      <div className="rounded flex flex-col bg-neutral-900 w-80 px-4 py-6 h-auto gap-8">
        {/* coverimage */}
        <div className="flex flex-col gap-6 ">
          <div className="flex font-bold">{currentSong.title}</div>
          <div className="flex flex-col gap-4">
            <Image  
            src={currentSong.coverUrl}
            alt="coverimage"
            width={320}
            height={320}
            className="rounded "
            />
            <div className="flex justify-between items-center"> 
              <div className="flex flex-col justify-center">
                <div className="text-2xl font-bold">{currentSong.title}</div>
                <div className="">{currentSong.artist}</div>
              </div>
              <div className="w-5 h-5 bg-neutral-900 flex justify-center rounded-full border-2 items-center font-bold" >+</div>
            </div>
            
          </div>

        </div>

        <div className="flex flex-col gap-4">
          <div className="font-bold">Related songs</div>
          <div className="flex overflow-x-auto gap-4 whitespace-nowrap">
            { recommendedTracks && recommendedTracks.map((song) => (
              <Card key={song.id} song={song} />
            ))}
          </div>

        </div>


        <div className="flex flex-col rounded">
          <div className="w-72 h-40 rounded p-4"
          style={{ backgroundImage: `url(${artistDetails.imageUrl})` }}
          >
            <div className="font-bold">About the artist</div>

          </div>
          <div className="bg-neutral-700 p-4 flex flex-col gap-3 rounded">
            <div className="font-bold">{currentSong.artist}</div>
            <div className="flex justify-between items-center">
              <div className="">{artistDetails.monthlyListeners}<br />monthly listeners</div>
              <div className="font-bold rounded-full border-1 py-1 px-2">Follow</div>
            </div>
            <div className="h-20 overflow-hidden ">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ab natus in tempora rerum, nostrum quo inventore ullam assumenda officia ea id doloribus possimus. Earum deleniti culpa ipsam pariatur amet doloribus?
          </div>
          </div>

          
        </div>

        <div className="bg-neutral-700 p-4 flex flex-col gap-3 rounded">
          <div className="flex justify-between items-end">
            <div className="font-bold"> Credits</div>
            <div className="text-sm">Show all</div>
          </div>
          <div className="flex justify-between items-center "> 
            <div> 
            <div className="font-bold">{currentSong.artist}</div>
            <div className="text-xs">Main Artist</div>
            </div>
            <div className="font-bold rounded-full border-1 py-1 px-2 ">Follow</div>
          
            
          </div>
          </div>
      </div>
    </aside>
    
  )
}