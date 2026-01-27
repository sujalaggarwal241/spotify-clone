"use client";
import { songs } from "../../../public/data/songs";
import { artists } from "../../../public/data/artists";
import PlayIcon from "@/iconComponents/Play";
import ShuffleIcon from "@/iconComponents/Shuffle";
import AlbumRow from "@/components/AlbumRow";
import { useEffect, useState } from "react";
export default function LikedSongs() {
	const [likedSongsIds, setLikedSongsIds] = useState<number[]>([]);
	const [likedSongs, setLikedSongs] = useState<typeof songs>([]);

	useEffect(() => {
		const loadLikedSongs = () => {
			try {
				const raw = localStorage.getItem("likedSongs");
				if (!raw) {
					setLikedSongsIds([]);
					setLikedSongs([]);
					return;
				}

				const parsed = JSON.parse(raw);
				const ids = Array.isArray(parsed)
					? parsed
							.map((v) => Number(v))
							.filter((n) => Number.isFinite(n))
					: [];

				setLikedSongsIds(ids);
				setLikedSongs(songs.filter((song) => ids.includes(song.id)));
			} catch {
				setLikedSongsIds([]);
				setLikedSongs([]);
			}
		};

		loadLikedSongs();

		const onLikedSongsChanged = () => loadLikedSongs();
		const onStorage = (e: StorageEvent) => {
			if (e.key === "likedSongs") loadLikedSongs();
		};

		window.addEventListener("likedSongsChanged", onLikedSongsChanged);
		window.addEventListener("storage", onStorage);

		return () => {
			window.removeEventListener("likedSongsChanged", onLikedSongsChanged);
			window.removeEventListener("storage", onStorage);
		};
	}, []);

	let totalTime = 0;
	for (const song of likedSongs) totalTime += song.duration;

	return (
		<div className="bg-neutral-900 w-full rounded-xl gap-6 flex flex-col">
			<div className="p-6 bg-neutral-600 rounded-top flex gap-6 ">
				<div className="h-54 w-54 bg-neutral-100 object-contain">
					<img className="h-full w-full" src="/coverImages/14.jpg" alt="" />
				</div>
				<div className="flex flex-col justify-end gap-4">
					<div>Album</div>
					<div className="text-8xl font-[1000]" >Liked Songs</div>
					<div className="flex gap-2">
						<div className="flex h-6 w-6 objext-contain rounded-full bg-neutral-100 items-center">
							<img className="h-full w-full rounded-full" src="/artistImages/1.jpg" alt="" />
						</div>
						<p className="font-bold flex">Sujal Aggarwal</p>
						<p>
							• {likedSongs.length} songs • {Math.floor(totalTime / 60)} min{" "}
							{totalTime % 60} secs
						</p>
					</div>
					
				</div>
			</div>
			<div className="p-6 w-full">
				<div className="flex h-18 w-full gap-4 items-center">
					<div className="h-14 w-14 bg-green-500 rounded-full flex justify-center items-center">
						<PlayIcon />
					</div>
					<div className="h-14 w-14 flex justify-center items-center text-4xl hover:bg-neutral-800 rounded-full">
						<ShuffleIcon />
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
				<div className="flex h-14 gap-4 items-center border-b mb-4 sticky top-0">
					<div className="h-10 w-10 items-center flex justify-center">#</div>
					<div className="">
						<div className="font-bold">Title</div>
					</div>
					<div className="flex-1"></div>
					<div className="mr-8">Clock</div>
				</div>
				{likedSongs.map((song, index) => {
					const artistName =
						artists.find((a) => a.id === song.artistId)?.name ?? "Unknown";
					return (
						<AlbumRow
							key={song.id}
							index={index + 1}
							song={song}
							artistName={artistName}
							duration={`${Math.floor(song.duration / 60)}:${String(
								Math.floor(song.duration % 60)
							).padStart(2, "0")}`}
							playlist={likedSongs}
						/>
					);
				})}
			</div>
		</div>
	)
}