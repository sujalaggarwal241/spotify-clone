"use client";
import type { Album } from "../../../../public/data/albums"
import { albums } from "../../../../public/data/albums";
import { songs } from "../../../../public/data/songs";
import { artists } from "../../../../public/data/artists";
import { useParams } from "next/navigation";
import PlayIcon from "@/iconComponents/Play";
import ShuffleIcon from "@/iconComponents/Shuffle";
import AlbumRow from "@/components/AlbumRow";
import { usePlayback } from "@/context/PlaybackContext";
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

	const { playSong } = usePlayback();
	const handlePlay = () => {
		playSong(albumSongs[0], albumSongs);
	}
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
				<div className="flex h-14 gap-4 items-center border-b mb-4 sticky top-0 bg-neutral-900">
					<div className="h-10 w-10 items-center flex justify-center">#</div>
					<div className="">
						<div className="font-bold">Title</div>
					</div>
					<div className="flex-1"></div>
					<div className="mr-8">Clock</div>
				</div>
				{albumSongs.map((song, index) => (
					<AlbumRow key={song.id} index={index+1} 
					song={song}
					artistName={artistDetails.name} 
					duration={`${Math.floor(song.duration/60)}:${Math.floor(song.duration%60)}`}
					playlist={albumSongs}
					 />
				))}
			</div>
		</div>
	)
}