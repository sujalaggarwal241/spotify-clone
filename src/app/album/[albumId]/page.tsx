"use client";
import type { Album } from "../../../../public/data/albums"
import { albums } from "../../../../public/data/albums";
import { songs } from "../../../../public/data/songs";
import { artists } from "../../../../public/data/artists";
import { useParams } from "next/navigation";
import PlayIcon from "@/iconComponents/Play";
import AlbumRow from "@/components/AlbumRow";
export default function Album() {

	const params = useParams();
  const albumId = params.albumId;

	const album = albums.filter(
		(album) => album.id === Number(albumId)
	)[0];

	const artistDetails = artists.filter(
		(artist) => album.artistId === artist.id
	)[0] ; 

	const albumSongs = songs.filter(
		(song) => song.albumId === Number(albumId)
	);

	let albumTime = 0;

	for(const song of albumSongs ){
		albumTime += song.duration;
	}
	return (
		<div className="bg-neutral-900 w-full rounded-xl gap-6 flex flex-col">
			<div className="p-6 bg-neutral-600 rounded-top flex gap-6 ">
				<div className="h-54 w-54 bg-neutral-100 object-contain">
					<img className="h-full w-full" src={album.coverUrl} alt="" />
				</div>
				<div className="flex flex-col justify-end gap-4">
					<div>Album</div>
					<div className="text-8xl font-[1000]" >{album.title}</div>
					<div className="flex gap-2">
						<div className="flex h-6 w-6 objext-contain rounded-full bg-neutral-100 items-center">
							<img className="h-full w-full rounded-full" src="/artistImages/1.jpg" alt="" />
						</div>
						<p className="font-bold flex">{artistDetails.name}</p>
							<p>• 2021 • {album.songIds.length} songs,  {Math.floor(albumTime/60)} min {albumTime%60} secs </p>
					</div>
				</div>
			</div>
			<div className="p-6 w-full">
				<div className="flex h-14 gap-4 items-center border-b mb-4 sticky top-0">
					<div className="h-10 w-10 items-center flex justify-center">#</div>
					<div className="">
						<div className="font-bold">Title</div>
					</div>
					<div className="flex-1"></div>
					<div className="mr-8">Clock</div>
				</div>
				{albumSongs.map((song, index) => (
					<AlbumRow key={song.id} index={index+1} 
					songTitle={song.title} 
					artistName={artistDetails.name} 
					duration={`${Math.floor(song.duration/60)}:${Math.floor(song.duration%60)}`} />
				))}
			</div>
		</div>
	)
}