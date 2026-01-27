"use client"; 
import LeftSidebarCard from "./LeftSidebarCard"
import { artists } from "../../public/data/artists"
import { albums } from "../../public/data/albums"
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function LeftSidebar() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState("");
  
  const toggleAlbum = () => {
    if(selectedOption === 'album'){
      setSelectedOption("");
    }
    else{
      setSelectedOption("album");
    }
  }
  const toggleArtist = () => {
    if(selectedOption === 'artist'){
      setSelectedOption("");
    }
    else{
      setSelectedOption("artist");
    }
  }
  const togglePlaylist = () => {
    if(selectedOption === 'playlist'){
      setSelectedOption("");
    }
    else{
      setSelectedOption("playlist");
    }
  }

  const Albums = useMemo(() => 
    albums.map((album) => (
      <LeftSidebarCard
      onClick={() => router.push(`/album/${album.id}`)}
      key={album.id}
      title={album.title} 
      image={album.coverUrl} 
      subtitle={"Album"} 
      type="album" />
    )), [albums, router]
  );
  
  const Artists = useMemo(() => 
    artists.map((artist) => (
      <LeftSidebarCard 
        key={artist.id} 
        onClick={() => router.push(`/artist/${artist.id}`)}
        title={artist.name} 
        subtitle="Artist" 
        image={artist.imageUrl} 
        type="artist"  />
    )), [artists, router]
  );

  

  const shuffled = useMemo(() => {
    const albumsAndArtists = Albums.concat(Artists);
    return [...albumsAndArtists].sort(() => Math.random() - 0.5);
  }, [Albums, Artists]);
  


  return (
    <aside className="w-70 h-full overflow-auto overscroll-contain bg-neutral-900 rounded-xl pb-4 px-4">
      <div className="sticky top-0 flex flex-col gap-3 bg-neutral-900 z-10 pt-6 pb-2">  
        <div className="flex gap-2 items-center">
          <div className="font-bold">Your Library</div>
          <div className="flex-1"></div>
          <div className="h-8 w-8 rounded-full bg-neutral-800 flex justify-center items-center text-3xl cursor-pointer hover:bg-neutral-700">+</div>
        </div> 

        <div className="text-sm flex gap-2">
          {selectedOption === "" && (
            <>
              <button onClick={togglePlaylist} className="px-3 py-1 rounded-full bg-neutral-800 font-medium text-sm hover:bg-neutral-700">
                Playlist 
              </button>  
              <button onClick={toggleArtist} className="px-3 py-1 rounded-full bg-neutral-800 font-medium text-sm hover:bg-neutral-700">
                Artists
              </button>
              <button onClick={toggleAlbum} className="px-3 py-1 rounded-full bg-neutral-800 font-medium text-sm hover:bg-neutral-700">
                Albums 
              </button>
            </>
          )}
          {selectedOption === "album" && (
            <button onClick={toggleAlbum} className="px-3 py-1 rounded-full text-black bg-white font-medium text-sm hover:bg-neutral-200">
              Albums
            </button>
          )}
          {selectedOption === "artist" && (
            <button onClick={toggleArtist} className="px-3 py-1 rounded-full text-black bg-white font-medium text-sm hover:bg-neutral-200">
              Artists
            </button>
          )}
          {selectedOption === "playlist" && (
            <button onClick={togglePlaylist} className="px-3 py-1 rounded-full text-black bg-white font-medium text-sm hover:bg-neutral-200">
              Playlist
            </button>
          )}

        
      </div>
      </div>
      <div className="flex flex-col gap-2 py-4" key={selectedOption}> 

        {(selectedOption === "" || selectedOption==="playlist") && <LeftSidebarCard onClick={()=> router.push('/likedsongs')} title="Liked songs " subtitle="Playlist" image="/coverImages/14.jpg" type="album" />}
        {selectedOption === ""
          ? shuffled
          : selectedOption === "album"
            ? Albums
            : selectedOption === "artist"
              ? Artists
              : null}

      </div>
    </aside>
  )
}